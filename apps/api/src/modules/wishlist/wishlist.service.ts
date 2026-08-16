import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true } },
            categories: { include: { category: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      addedAt: item.createdAt,
      product: {
        ...item.product,
        price: Number(item.product.price),
        compareAtPrice: item.product.compareAtPrice ? Number(item.product.compareAtPrice) : null,
        categories: item.product.categories?.map((c: any) => c.category || c) || [],
      },
    }));
  }

  async addToWishlist(userId: string, productId: string) {
    // Check if already in wishlist
    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      throw new ConflictException('Product is already in your wishlist');
    }

    const item = await this.prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: {
          include: { images: { where: { isPrimary: true } } },
        },
      },
    });

    return item;
  }

  async removeFromWishlist(userId: string, productId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    return { removed: true };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  }
}
