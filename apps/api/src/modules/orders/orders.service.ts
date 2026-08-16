import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderInput } from '@bright-ideas/shared';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // 1. Fetch product prices from DB (NEVER trust client prices!)
    const productIds = input.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more selected products are invalid or inactive');
    }

    let subtotal = 0;
    const orderItemsData = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const priceNum = Number(product.price);
      const itemSubtotal = priceNum * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: product.id,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // 2. Validate coupon if provided
    let discountAmount = 0;
    let couponId: string | undefined = undefined;

    if (input.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });

      if (coupon && coupon.status === 'ACTIVE' && new Date() <= coupon.expiresAt) {
        if (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) {
          couponId = coupon.id;
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
              discountAmount = Number(coupon.maxDiscount);
            }
          } else {
            discountAmount = Number(coupon.discountValue);
          }
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);

    // 3. Generate Order Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BRI-${dateStr}-${randomSuffix}`;

    // 4. Create Order in Database
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        subtotal,
        discountAmount,
        total: totalAmount,
        currency: 'ETB',
        couponId,
        customerEmail: input.customerEmail,
        customerName: `${input.customerFirstName} ${input.customerLastName}`,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true } } },
            },
          },
        },
      },
    });

    return this.transformOrder(order);
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                files: { select: { id: true, fileName: true } },
              },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.transformOrder(o));
  }

  async getOrderById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                files: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.transformOrder(order);
  }

  async markOrderAsPaid(orderId: string, transactionRef: string) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
      },
      include: { items: true },
    });

    // Increment sales count on products
    for (const item of order.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { totalSales: { increment: item.quantity } },
      });
    }

    return order;
  }

  private transformOrder(order: any) {
    return {
      ...order,
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount),
      totalAmount: Number(order.total),
      items: order.items?.map((item: any) => ({
        ...item,
        price: Number(item.price),
        totalPrice: Number(item.price) * item.quantity,
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
            }
          : undefined,
      })),
    };
  }
}
