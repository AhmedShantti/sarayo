import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';

const BCRYPT_ROUNDS = 12;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ──────────────────────────────────────────────
  // Public flows
  // ──────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        name: dto.name,
        nameAr: dto.nameAr,
        phone: dto.phone,
        role: Role.CUSTOMER,
        // Every customer gets an empty cart up front.
        cart: { create: {} },
      },
    });

    const tokens = await this.issueTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    return { user: this.sanitize(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    let payload: { sub: string; email: string; role: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token revoked');
    }
    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const tokens = await this.issueTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Always return the same message to avoid leaking which emails exist.
    const genericMessage = 'If that email exists, a reset link has been sent';
    if (!user) {
      return { message: genericMessage };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    });

    // TODO: swap console.log for a real transactional email provider (e.g. SES/Resend).
    const resetUrl = `${this.config.get('frontendUrl')}/reset-password?token=${rawToken}`;
    this.logger.log(`[MOCK EMAIL] Password reset for ${user.email}: ${resetUrl}`);

    return { message: genericMessage };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        refreshToken: null, // force re-login everywhere
      },
    });
    return { message: 'Password reset successfully' };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        nameAr: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private async issueTokens(user: Pick<User, 'id' | 'email' | 'role'>): Promise<Tokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiry'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiry'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  /** Strip the password (and other secrets) before returning a user. */
  private sanitize(user: User) {
    const { password, refreshToken, resetToken, resetTokenExpiry, ...safe } = user;
    return safe;
  }
}
