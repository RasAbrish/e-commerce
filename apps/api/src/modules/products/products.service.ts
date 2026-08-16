import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductInput, UpdateProductInput, ProductQuery } from '@bright-ideas/shared';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'ACTIVE',
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    if (query.category) {
      where.categories = {
        some: {
          category: {
            slug: query.category,
          },
        },
      };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    const orderBy: any = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          categories: { include: { category: true } },
          files: { select: { id: true, fileName: true, fileSize: true, mimeType: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(p => this.transformProduct(p)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured() {
    const products = await this.prisma.product.findMany({
      where: { status: 'ACTIVE', isFeatured: true },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
    return products.map(p => this.transformProduct(p));
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        files: { select: { id: true, fileName: true, fileSize: true, mimeType: true } },
        reviews: {
          where: { isVisible: true },
          include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.transformProduct(product);
  }

  async create(data: CreateProductInput) {
    const { categoryIds, ...productData } = data;
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        price: productData.price,
        categories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });

    return this.transformProduct(product);
  }

  async update(id: string, data: UpdateProductInput) {
    const { categoryIds, ...productData } = data;

    if (categoryIds) {
      await this.prisma.productCategory.deleteMany({ where: { productId: id } });
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categories: categoryIds
          ? { create: categoryIds.map((catId) => ({ categoryId: catId })) }
          : undefined,
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });

    return this.transformProduct(product);
  }

  async addImage(productId: string, url: string, isPrimary = false) {
    return this.prisma.productImage.create({
      data: { productId, url, isPrimary },
    });
  }

  async addFile(productId: string, fileData: { fileName: string; fileSize: number; mimeType: string; storagePath: string }) {
    return this.prisma.productFile.create({
      data: {
        productId,
        ...fileData,
      },
    });
  }

  private transformProduct(product: any) {
    return {
      ...product,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      categories: product.categories?.map((c: any) => c.category || c) || [],
    };
  }
}
