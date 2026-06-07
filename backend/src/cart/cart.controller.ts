import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's cart with product details" })
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get cart subtotal, shipping, tax and total' })
  getSummary(@CurrentUser('id') userId: string) {
    return this.cartService.getSummary(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart (validates stock)' })
  addItem(@CurrentUser('id') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update an item quantity' })
  updateItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, productId, dto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  removeItem(@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the cart' })
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
