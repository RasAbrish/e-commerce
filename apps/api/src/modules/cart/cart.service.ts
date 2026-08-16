import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const cartItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        compareAtPrice: item.product.compareAtPrice ? Number(item.product.compareAtPrice) : null,
        type: item.product.type,
        status: item.product.status,
        primaryImage: item.product.images[0]?.url || null,
      },
    }));

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      items: cartItems,
      itemCount: cartItems.length,
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    // Verify product exists and is active
    const product = await this.prisma.product.findFirst({
      where: { id: productId, status: 'ACTIVE' },
    });

    if (!product) {
      throw new NotFoundException('Product not found or inactive');
    }

    // For digital products, quantity is always 1 and no duplicates
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      throw new BadRequestException('Product is already in your cart');
    }

    const item = await this.prisma.cartItem.create({
      data: { userId, productId, quantity: 1 },
      include: {
        product: {
          include: { images: { where: { isPrimary: true } } },
        },
      },
    });

    return item;
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: { images: { where: { isPrimary: true } } },
        },
      },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { removed: true };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { cleared: true };
  }
}
