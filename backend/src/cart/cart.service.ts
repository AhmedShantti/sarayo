import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../common/pricing/pricing.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricing: PricingService,
  ) {}

  /** Returns the user's cart, creating an empty one on first access. */
  async getCart(userId: string) {
    const cart = await this.ensureCart(userId);
    return this.buildCartResponse(cart.id);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.ensureCart(userId);
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock <= 0) {
      throw new BadRequestException(`${product.name} is out of stock`);
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    });
    const desiredQty = (existing?.quantity ?? 0) + dto.quantity;

    if (desiredQty > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} unit(s) of ${product.name} are available`,
      );
    }

    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: dto.quantity,
        price: product.price,
      },
      // Re-snapshot the price on each add so it reflects the current price.
      update: { quantity: desiredQty, price: product.price },
    });

    return this.buildCartResponse(cart.id);
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    const cart = await this.ensureCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
      include: { product: true },
    });
    if (!item) throw new NotFoundException('Item not in cart');

    if (dto.quantity > item.product.stock) {
      throw new BadRequestException(
        `Only ${item.product.stock} unit(s) of ${item.product.name} are available`,
      );
    }

    await this.prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity: dto.quantity, price: item.product.price },
    });
    return this.buildCartResponse(cart.id);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.ensureCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (!item) throw new NotFoundException('Item not in cart');

    await this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    return this.buildCartResponse(cart.id);
  }

  async clearCart(userId: string) {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.buildCartResponse(cart.id);
  }

  async getSummary(userId: string) {
    const cart = await this.ensureCart(userId);
    const response = await this.buildCartResponse(cart.id);
    return {
      itemCount: response.itemCount,
      ...this.pricing.calculate(response.subtotal),
    };
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private async ensureCart(userId: string) {
    const existing = await this.prisma.cart.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.cart.create({ data: { userId } });
  }

  /**
   * Builds the cart payload with live product details. Cart line prices are
   * always recalculated from the current product price on fetch (per spec).
   */
  private async buildCartResponse(cartId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });

    const lines = items.map((item) => {
      const livePrice = Number(item.product.price);
      return {
        id: item.id,
        productId: item.productId,
        sku: item.product.sku,
        name: item.product.name,
        nameAr: item.product.nameAr,
        slug: item.product.slug,
        image: item.product.images[0] ?? null,
        price: livePrice,
        quantity: item.quantity,
        stock: item.product.stock,
        lineTotal: Number((livePrice * item.quantity).toFixed(2)),
      };
    });

    const subtotal = Number(lines.reduce((s, l) => s + l.lineTotal, 0).toFixed(2));
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

    return { cartId, items: lines, itemCount, subtotal };
  }
}
