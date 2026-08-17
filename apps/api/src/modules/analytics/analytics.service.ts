import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminOverview() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalRevenueResult,
      prevRevenueResult,
      totalOrders,
      prevOrders,
      totalCustomers,
      prevCustomers,
      totalProducts,
      activeProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: 'PAID', createdAt: { gte: thirtyDaysAgo } },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: { status: 'PAID', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        _sum: { total: true },
      }),
      this.prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'ACTIVE' } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      this.prisma.product.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { totalSales: 'desc' },
        take: 5,
        select: { id: true, name: true, slug: true, totalSales: true, price: true },
      }),
    ]);

    const totalRevenue = Number(totalRevenueResult._sum.total || 0);
    const prevRevenue = Number(prevRevenueResult._sum.total || 0);

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalRevenue,
      revenueChange: calcChange(totalRevenue, prevRevenue),
      totalOrders,
      ordersChange: calcChange(totalOrders, prevOrders),
      totalCustomers,
      customersChange: calcChange(totalCustomers, prevCustomers),
      totalProducts,
      activeProducts,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
      })),
      topProducts: topProducts.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
    };
  }

  async getRevenueOverTime(period: string = '30d') {
    let days = 30;
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    else if (period === '12m') days = 365;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await this.prisma.order.findMany({
      where: { status: 'PAID', createdAt: { gte: startDate } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const revenueMap = new Map<string, number>();
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + Number(order.total));
    }

    return Array.from(revenueMap.entries()).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));
  }

  async getTopProducts(limit = 10) {
    const products = await this.prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { totalSales: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        totalSales: true,
        price: true,
        averageRating: true,
        type: true,
      },
    });

    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      revenue: Number(p.price) * p.totalSales,
    }));
  }

  getSystemSettings() {
    return {
      storeName: 'Bright Ideas Digital Store',
      currency: 'ETB',
      paymentProvider: 'Chapa',
      fileDelivery: process.env.STORAGE_TYPE || 'LOCAL',
      apiEnvironment: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || '*',
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      chapaConfigured: Boolean(process.env.CHAPA_SECRET_KEY),
      appUrl: process.env.APP_URL || null,
    };
  }

  updateSystemSettings(data: any) {
    return {
      ...this.getSystemSettings(),
      storeName: data?.storeName || 'Bright Ideas Digital Store',
      currency: data?.currency || 'ETB',
      paymentProvider: data?.paymentProvider || 'Chapa',
      message: 'Settings validated. Environment-backed values must be changed in the hosting dashboard.',
    };
  }

  // --- Admin Order Management ---

  async getAllOrders(page = 1, limit = 20, status?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          payment: true,
          items: {
            include: {
              product: {
                select: { name: true, slug: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        discountAmount: Number(o.discountAmount),
        total: Number(o.total),
        items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }
}
