import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateStockDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List products with filters, sort and pagination' })
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'List featured products' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search products by keyword' })
  @ApiQuery({ name: 'q', required: true })
  search(@Query('q') q: string) {
    return this.productsService.search(q);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a product by slug with rating' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}

@ApiTags('Admin · Products')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product (isActive = false)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update product stock quantity' })
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.productsService.updateStock(id, dto);
  }
}
