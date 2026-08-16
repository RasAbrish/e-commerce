import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewInput } from '@bright-ideas/shared';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, isVisible: true },
        include: {
          user: {
            select: { firstName: true, lastName: true, avatarUrl: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { productId, isVisible: true } }),
    ]);

    return {
      reviews,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createReview(userId: string, data: CreateReviewInput) {
    // Verify user purchased product
    const purchased = await this.prisma.order.findFirst({
      where: {
        userId,
        status: 'PAID',
        items: {
          some: { productId: data.productId },
        },
      },
    });

    if (!purchased) {
      throw new BadRequestException('Only verified buyers can leave a review');
    }

    const review = await this.prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
      create: {
        userId,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      },
      update: {
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      },
    });

    await this.updateProductRating(data.productId);
    return review;
  }

  async updateReview(userId: string, reviewId: string, data: { rating?: number; title?: string; comment?: string }) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      },
    });

    await this.updateProductRating(review.productId);
    return updated;
  }

  async deleteReview(userId: string, reviewId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Admins can delete any review, users only their own
    if (review.userId !== userId && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.updateProductRating(review.productId);
  }

  private async updateProductRating(productId: string) {
    const aggregates = await this.prisma.review.aggregate({
      where: { productId, isVisible: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: aggregates._avg.rating || 0,
        totalReviews: aggregates._count.rating || 0,
      },
    });
  }
}

