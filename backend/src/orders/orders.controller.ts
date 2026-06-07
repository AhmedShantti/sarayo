import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AdminQueryOrdersDto, QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order from the cart and initiate Paymob payment' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List own orders (paginated)' })
  findAll(@CurrentUser('id') userId: string, @Query() query: QueryOrdersDto) {
    return this.ordersService.findUserOrders(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order with its items' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.findOne(userId, id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending order' })
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.cancel(userId, id);
  }
}

@ApiTags('Admin · Orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all orders (filterable)' })
  findAll(@Query() query: AdminQueryOrdersDto) {
    return this.ordersService.adminFindAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard metrics: revenue, counts, top products' })
  stats() {
    return this.ordersService.adminStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Full order details' })
  findOne(@Param('id') id: string) {
    return this.ordersService.adminFindOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (validated transitions)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.adminUpdateStatus(id, dto);
  }
}
