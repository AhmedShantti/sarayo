import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateStockDto } from './dto/update-product.dto';
import { ProductSort, QueryProductsDto } from './dto/query-products.dto';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { slugify } from '../common/utils/slug.util';

// Stock thresholds powering the dashboard's stock badge (out / low / active).
const LOW_STOCK_THRESHOLD = 15;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // Public
  // ──────────────────────────────────────────────

  async findAll(query: QueryProductsDto) {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.category) where.category = { slug: query.category };
    if (query.flavor) where.flavor = query.flavor;
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = this.buildOrderBy(query.sortBy);

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: query.skip,
        take: query.limit,
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: products.map((p) => this.toResponse(p)),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true, nameAr: true } } },
        },
      },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    const ratings = product.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;

    return {
      ...this.toResponse(product),
      reviews: product.reviews,
      averageRating: Number(averageRating.toFixed(2)),
      reviewCount: ratings.length,
    };
  }

  async findFeatured() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return products.map((p) => this.toResponse(p));
  }

  async search(q: string) {
    if (!q?.trim()) return [];
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { nameAr: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { flavor: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return products.map((p) => this.toResponse(p));
  }

  // ──────────────────────────────────────────────
  // Admin
  // ──────────────────────────────────────────────

  async create(dto: CreateProductDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    const product = await this.prisma.product.create({
      data: {
        sku: dto.sku,
        name: dto.name,
        nameAr: dto.nameAr,
        slug,
        description: dto.description,
        descriptionAr: dto.descriptionAr,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        stock: dto.stock,
        images: dto.images ?? [],
        flavor: dto.flavor,
        weight: dto.weight,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        categoryId: dto.categoryId,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return this.toResponse(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.assertExists(id);
    const data: Prisma.ProductUpdateInput = { ...dto } as Prisma.ProductUpdateInput;
    if (dto.slug) (data as any).slug = slugify(dto.slug);
    // categoryId is a scalar relation field — pass it through directly.
    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return this.toResponse(product);
  }

  /** Soft delete — keeps order history intact. */
  async remove(id: string) {
    await this.assertExists(id);
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    return { message: 'Product deactivated' };
  }

  async updateStock(id: string, dto: UpdateStockDto) {
    await this.assertExists(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock: dto.stock },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return this.toResponse(product);
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private buildOrderBy(
    sort?: ProductSort,
  ): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case ProductSort.PRICE_ASC:
        return { price: 'asc' };
      case ProductSort.PRICE_DESC:
        return { price: 'desc' };
      case ProductSort.POPULAR:
        // Approximate popularity by number of times ordered.
        return { orderItems: { _count: 'desc' } };
      case ProductSort.NEWEST:
      default:
        return { createdAt: 'desc' };
    }
  }

  private async assertExists(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  /**
   * Normalises a Product row for API responses: Decimal → number and a derived
   * stock `status` (out | low | active) consumed by the dashboard badge.
   */
  private toResponse(product: Product & { category?: any }) {
    const status = product.stock <= 0 ? 'out' : product.stock <= LOW_STOCK_THRESHOLD ? 'low' : 'active';
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      nameAr: product.nameAr,
      slug: product.slug,
      description: product.description,
      descriptionAr: product.descriptionAr,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice !== null ? Number(product.compareAtPrice) : null,
      stock: product.stock,
      status,
      images: product.images,
      flavor: product.flavor,
      weight: product.weight,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId,
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
