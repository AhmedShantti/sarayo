import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, PaymentStatus, Prisma, Product, Role } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../common/pricing/pricing.service';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
import { AdminQueryOrdersDto, QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaymentsService } from '../payments/payments.service';

// Allowed status transitions for admin updates.
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'PROCESSING', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'SHIPPED', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
};

const ORDER_NUMBER_BASE = 10500;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pricing: PricingService,
    // forwardRef breaks the Orders <-> Payments circular dependency.
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
  ) {}

  // ──────────────────────────────────────────────
  // Create order from cart
  // ──────────────────────────────────────────────

  async create(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // Validate stock for every line up front.
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`${item.product.name} is no longer available`);
      }
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Only ${item.product.stock} unit(s) of ${item.product.name} are available`,
        );
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + this.effectiveUnitPrice(item.product) * item.quantity,
      0,
    );
    const breakdown = this.pricing.calculate(subtotal);

    const shippingAddress = {
      ...dto.shippingAddress,
      country: dto.shippingAddress.country ?? 'Egypt',
    } as Prisma.JsonObject;

    // Atomic: create order + items, decrement stock, clear cart.
    const order = await this.prisma.$transaction(async (tx) => {
      const orderNumber = await this.nextOrderNumber(tx);

      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          subtotal: breakdown.subtotal,
          shippingCost: breakdown.shippingCost,
          tax: breakdown.tax,
          total: breakdown.total,
          shippingAddress,
          notes: dto.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: this.effectiveUnitPrice(item.product),
              productName: item.product.name,
              productImage: item.product.images[0] ?? null,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement stock.
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear the cart.
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    // Initiate Paymob payment (Step 1–3). Failure here must not roll back the
    // order — the customer can retry payment via POST /payments/initiate.
    let payment: { paymentKey: string; iframeUrl: string; paymobOrderId: number } | null = null;
    try {
      payment = await this.paymentsService.initiate(userId, order.id);
    } catch (err) {
      this.logger.error(
        `Paymob initiation failed for order ${order.orderNumber}: ${(err as Error).message}`,
      );
    }

    const full = await this.findOne(userId, order.id);
    return {
      order: full,
      paymentKey: payment?.paymentKey ?? null,
      iframeUrl: payment?.iframeUrl ?? null,
      paymobOrderId: payment?.paymobOrderId ?? null,
      paymentInitiated: payment !== null,
    };
  }

  // ──────────────────────────────────────────────
  // Guest checkout (no auth) — used by the storefront
  // ──────────────────────────────────────────────

  /**
   * The price a customer pays per ordered unit. When a product is sold by the
   * package this is the package price (falling back to price × packageSize);
   * otherwise it's the per-piece price.
   */
  private effectiveUnitPrice(product: Product): number {
    if (product.sellingUnit === 'package') {
      return product.packagePrice !== null
        ? Number(product.packagePrice)
        : Number(product.price) * product.packageSize;
    }
    return Number(product.price);
  }

  async createGuestOrder(dto: CreateGuestOrderDto) {
    // 1. Resolve every line. A line either links to a catalog product (by id or
    //    sku — stock is checked + decremented) or is a self-described snapshot
    //    (name + price) from the storefront's static catalog.
    const resolved: Array<{
      productId: string | null;
      quantity: number;
      price: number;
      productName: string;
      productImage: string | null;
      decrementStock: boolean;
    }> = [];

    for (const line of dto.items) {
      let product: Product | null = null;
      if (line.productId || line.sku) {
        product = await this.prisma.product.findFirst({
          where: line.productId ? { id: line.productId } : { sku: line.sku },
        });
      }

      if (product) {
        if (!product.isActive) {
          throw new BadRequestException(`${product.name} is no longer available`);
        }
        if (line.quantity > product.stock) {
          throw new BadRequestException(
            `Only ${product.stock} unit(s) of ${product.name} are available`,
          );
        }
        resolved.push({
          productId: product.id,
          quantity: line.quantity,
          price: this.effectiveUnitPrice(product),
          productName: product.name,
          productImage: product.images[0] ?? null,
          decrementStock: true,
        });
      } else if (line.name && line.price != null) {
        // Catalog-less storefront item — store as a snapshot, no stock change.
        resolved.push({
          productId: null,
          quantity: line.quantity,
          price: line.price,
          productName: line.name,
          productImage: line.image ?? null,
          decrementStock: false,
        });
      } else {
        throw new BadRequestException(
          `Order line is missing a productId/sku or a name+price: ${line.name ?? line.sku ?? line.productId ?? 'unknown'}`,
        );
      }
    }

    // 2. Find or create a lightweight customer keyed by email.
    const guest = await this.resolveGuestUser(dto.customer, dto.email, dto.phone);

    // 3. Totals.
    const subtotal = resolved.reduce((sum, r) => sum + r.price * r.quantity, 0);
    const breakdown = this.pricing.calculate(subtotal);

    const shippingAddress = {
      fullName: dto.customer,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      street: dto.address ?? 'NA',
      city: 'NA',
      state: 'NA',
      country: 'Egypt',
      postalCode: 'NA',
      method: dto.method ?? 'card',
    } as Prisma.JsonObject;

    // 4. Atomic create + stock decrement.
    const order = await this.prisma.$transaction(async (tx) => {
      const orderNumber = await this.nextOrderNumber(tx);
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: guest.id,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          subtotal: breakdown.subtotal,
          shippingCost: breakdown.shippingCost,
          tax: breakdown.tax,
          total: breakdown.total,
          shippingAddress,
          notes: dto.notes,
          items: {
            create: resolved.map((r) => ({
              productId: r.productId,
              quantity: r.quantity,
              price: r.price,
              productName: r.productName,
              productImage: r.productImage,
            })),
          },
        },
        include: { items: true },
      });
      // Decrement stock only for lines linked to a catalog product.
      for (const r of resolved) {
        if (r.decrementStock && r.productId) {
          await tx.product.update({
            where: { id: r.productId },
            data: { stock: { decrement: r.quantity } },
          });
        }
      }
      return created;
    });

    this.logger.log(`Guest order ${order.orderNumber} created for ${dto.customer}`);
    return this.toResponse(order);
  }

  /** Find an existing user by email, or create a passwordless guest customer. */
  private async resolveGuestUser(name: string, email?: string, phone?: string) {
    const guestEmail = (email && email.trim()) || 'guest@sarayo.store';
    const existing = await this.prisma.user.findUnique({ where: { email: guestEmail } });
    if (existing) return existing;

    // Random unusable password — guests can't log in until they reset it.
    const randomPassword = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 12);
    return this.prisma.user.create({
      data: {
        email: guestEmail,
        password: randomPassword,
        name: name || 'Guest',
        phone,
        role: Role.CUSTOMER,
      },
    });
  }

  // ──────────────────────────────────────────────
  // Customer reads
  // ──────────────────────────────────────────────

  async findUserOrders(userId: string, query: QueryOrdersDto) {
    const where: Prisma.OrderWhereInput = { userId };
    if (query.status) where.status = query.status;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: orders.map((o) => this.toResponse(o)),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }
    return this.toResponse(order);
  }

  async cancel(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // Restore stock (only for catalog-linked lines).
      for (const item of order.items) {
        if (!item.productId) continue;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: { items: true, payment: true },
      });
    });
    return this.toResponse(updated);
  }

  // ──────────────────────────────────────────────
  // Admin
  // ──────────────────────────────────────────────

  async adminFindAll(query: AdminQueryOrdersDto) {
    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
      if (query.dateTo) where.createdAt.lte = new Date(query.dateTo);
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { id: true, name: true, nameAr: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: orders.map((o) => this.toResponse(o)),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async adminFindOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payment: true,
        user: { select: { id: true, name: true, nameAr: true, email: true, phone: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.toResponse(order);
  }

  async adminUpdateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === dto.status) {
      throw new BadRequestException(`Order is already ${dto.status}`);
    }
    const allowed = STATUS_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${dto.status}`,
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // Restore stock when an order is cancelled (catalog-linked lines only).
      if (dto.status === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          if (!item.productId) continue;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      return tx.order.update({
        where: { id },
        data: { status: dto.status },
        include: { items: true, payment: true },
      });
    });
    return this.toResponse(updated);
  }

  async adminStats() {
    const [revenueAgg, totalOrders, pendingOrders, statusGroups, topItems] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } },
        _sum: { total: true },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const statusBreakdown = statusGroups.reduce<Record<string, number>>((acc, g) => {
      acc[g.status] = g._count._all;
      return acc;
    }, {});

    const topProducts = topItems.map((t) => ({
      productId: t.productId,
      name: t.productName,
      sold: t._sum.quantity ?? 0,
      revenue: Number(t._sum.price ?? 0),
    }));

    return {
      revenue: Number(revenueAgg._sum.total ?? 0),
      orders: totalOrders,
      pendingOrders,
      statusBreakdown,
      topProducts,
    };
  }

  // ──────────────────────────────────────────────
  // Payment lifecycle hooks (called by PaymentsService)
  // ──────────────────────────────────────────────

  async setPaymentIntent(orderId: string, paymobOrderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: paymobOrderId },
    });
  }

  async markPaid(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.PAID, status: OrderStatus.CONFIRMED },
    });
  }

  async markPaymentFailed(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
  }

  async markRefunded(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.REFUNDED, status: OrderStatus.REFUNDED },
    });
  }

  /** Used internally by PaymentsService to load an order with relations. */
  async getOrderEntity(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private async nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
    const last = await tx.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    });
    const lastNum = last ? parseInt(last.orderNumber.replace(/\D/g, ''), 10) : ORDER_NUMBER_BASE - 1;
    const next = (Number.isFinite(lastNum) ? lastNum : ORDER_NUMBER_BASE - 1) + 1;
    return `#${next}`;
  }

  /** Serialise an order, converting Decimals to numbers. */
  private toResponse(order: any) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      user: order.user,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      tax: Number(order.tax),
      total: Number(order.total),
      shippingAddress: order.shippingAddress,
      paymentIntentId: order.paymentIntentId,
      notes: order.notes,
      itemCount: order.items?.reduce((n: number, i: any) => n + i.quantity, 0) ?? 0,
      items: order.items?.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        quantity: i.quantity,
        price: Number(i.price),
        lineTotal: Number((Number(i.price) * i.quantity).toFixed(2)),
      })),
      payment: order.payment
        ? {
            id: order.payment.id,
            status: order.payment.status,
            amount: Number(order.payment.amount),
            currency: order.payment.currency,
            paymobTransactionId: order.payment.paymobTransactionId,
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
