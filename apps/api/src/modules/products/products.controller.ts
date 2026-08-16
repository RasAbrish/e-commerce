import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: any) {
    const result = await this.productsService.findAll(query);
    return { success: true, data: result.products, meta: result.meta };
  }

  @Get('featured')
  async findFeatured() {
    const products = await this.productsService.findFeatured();
    return { success: true, data: products };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    return { success: true, data: product };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(@Body() body: any) {
    const product = await this.productsService.create(body);
    return { success: true, data: product };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const product = await this.productsService.update(id, body);
    return { success: true, data: product };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post(':id/images')
  async addImage(@Param('id') id: string, @Body() body: { url: string; isPrimary?: boolean }) {
    const image = await this.productsService.addImage(id, body.url, body.isPrimary);
    return { success: true, data: image };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post(':id/files')
  async addFile(
    @Param('id') id: string,
    @Body() fileData: { fileName: string; fileSize: number; mimeType: string; storagePath: string },
  ) {
    const file = await this.productsService.addFile(id, fileData);
    return { success: true, data: file };
  }
}
