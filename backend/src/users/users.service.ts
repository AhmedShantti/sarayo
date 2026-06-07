import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { buildPaginationMeta } from '../common/dto/pagination.dto';

// Re-used everywhere we return a user so password/secrets never leak.
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  nameAr: true,
  role: true,
  phone: true,
  address: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // Profile
  // ──────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: SAFE_USER_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: SAFE_USER_SELECT,
    });
  }

  // ──────────────────────────────────────────────
  // Addresses
  // ──────────────────────────────────────────────

  async listAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async addAddress(userId: string, dto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      // First address (or one explicitly marked default) becomes the default.
      const count = await tx.address.count({ where: { userId } });
      const makeDefault = dto.isDefault || count === 0;
      if (makeDefault) {
        await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
      }
      return tx.address.create({
        data: { ...dto, isDefault: makeDefault, userId },
      });
    });
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    await this.assertAddressOwnership(userId, addressId);
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
      }
      return tx.address.update({ where: { id: addressId }, data: dto });
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    await this.assertAddressOwnership(userId, addressId);
    await this.prisma.address.delete({ where: { id: addressId } });
    return { message: 'Address deleted' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    await this.assertAddressOwnership(userId, addressId);
    return this.prisma.$transaction(async (tx) => {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
      return tx.address.update({ where: { id: addressId }, data: { isDefault: true } });
    });
  }

  private async assertAddressOwnership(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }
    return address;
  }

  // ──────────────────────────────────────────────
  // Admin
  // ──────────────────────────────────────────────

  async adminListUsers(query: QueryUsersDto) {
    const where: Prisma.UserWhereInput = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          ...SAFE_USER_SELECT,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    // Roll up lifetime spend per user (matches dashboard "spend" column).
    const items = await Promise.all(
      users.map(async (u) => {
        const agg = await this.prisma.order.aggregate({
          where: { userId: u.id, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
          _sum: { total: true },
        });
        return {
          ...u,
          orders: u._count.orders,
          spend: Number(agg._sum.total ?? 0),
        };
      }),
    );

    return { items, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async adminGetUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...SAFE_USER_SELECT,
        addresses: true,
        orders: {
          select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async adminUpdateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: SAFE_USER_SELECT,
    });
  }
}
