import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponInput, ValidateCouponInput } from '@bright-ideas/shared';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(input: ValidateCouponInput) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: input.code.toUpperCase() },
    });

    if (!coupon || coupon.status !== 'ACTIVE') {
      throw new BadRequestException('Invalid or inactive coupon code');
    }

    if (new Date() > coupon.expiresAt) {
      throw new BadRequestException('This coupon has expired');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const minAmount = Number(coupon.minOrderAmount || 0);
    if (input.orderAmount < minAmount) {
      throw new BadRequestException(`Minimum order amount of ETB ${minAmount} required for this coupon`);
    }

    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (input.orderAmount * discountVal) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = discountVal;
    }

    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: discountVal,
      calculatedDiscount: Math.min(input.orderAmount, discountAmount),
    };
  }

  async create(data: CreateCouponInput) {
    const expiresAt = data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const startsAt = new Date();

    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscountAmount,
        maxUses: data.usageLimit,
        startsAt,
        expiresAt,
      },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
