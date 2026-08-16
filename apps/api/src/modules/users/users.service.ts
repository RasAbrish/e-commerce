import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileInput } from '@bright-ideas/shared';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitize(user);
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
    });

    return this.sanitize(user);
  }

  // --- Admin endpoints ---

  async findAllCustomers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { role: 'CUSTOMER' };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { orders: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      customers,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getCustomerDetail(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { payment: true },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { product: { select: { name: true, slug: true } } },
        },
        _count: { select: { orders: true, reviews: true, wishlist: true, downloads: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Customer not found');
    }

    return this.sanitize(user);
  }

  private sanitize(user: any) {
    const { passwordHash, refreshToken, ...sanitized } = user;
    return sanitized;
  }
}
