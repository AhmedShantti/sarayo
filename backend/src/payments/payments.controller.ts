import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, RefundDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SkipTransform } from '../common/decorators/skip-transform.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('initiate')
  @ApiOperation({ summary: 'Run the Paymob 3-step flow and return a payment key + iframe URL' })
  initiate(@CurrentUser('id') userId: string, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(userId, dto.orderId);
  }

  @Public()
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paymob server-to-server transaction callback (HMAC-verified)' })
  async transactionCallback(@Req() req: Request, @Body() body: any) {
    // HMAC is delivered as a query param on the callback URL.
    const hmac = (req.query.hmac as string) ?? body?.hmac;
    await this.paymentsService.handleTransactionCallback(body, hmac);
    // Always 200 so Paymob does not retry. (Errors are logged server-side.)
    return { received: true };
  }

  @Public()
  @SkipTransform()
  @Get('callback')
  @ApiExcludeEndpoint()
  async redirectCallback(@Query() query: Record<string, any>, @Res() res: Response) {
    const redirectUrl = await this.paymentsService.handleRedirectCallback(query);
    return res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @Post('refund')
  @ApiOperation({ summary: 'Refund a Paymob transaction (admin only)' })
  refund(@Body() dto: RefundDto) {
    return this.paymentsService.refund(dto);
  }
}

@ApiTags('Admin · Payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all payments with aggregate stats (admin)' })
  list() {
    return this.paymentsService.adminListPayments();
  }
}
