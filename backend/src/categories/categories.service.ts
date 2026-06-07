import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { slugify } from '../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      isActive: c.isActive,
      productCount: c._count.products,
    }));
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    return this.prisma.category.create({
      data: { ...dto, slug },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.assertExists(id);
    const data: UpdateCategoryDto = { ...dto };
    if (dto.slug) data.slug = slugify(dto.slug);
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.assertExists(id);
    const productCount = await this.prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete a category that still has products. Reassign or remove them first.',
      );
    }
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }

  private async assertExists(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
