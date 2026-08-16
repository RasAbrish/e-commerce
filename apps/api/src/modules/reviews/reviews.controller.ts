import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.reviewsService.getProductReviews(
      productId,
      Number(page) || 1,
      Number(limit) || 10,
    );
    return { success: true, data: result.reviews, meta: result.meta };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@CurrentUser('id') userId: string, @Body() body: any) {
    const review = await this.reviewsService.createReview(userId, body);
    return { success: true, data: review };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateReview(
    @CurrentUser('id') userId: string,
    @Param('id') reviewId: string,
    @Body() body: any,
  ) {
    const review = await this.reviewsService.updateReview(userId, reviewId, body);
    return { success: true, data: review };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(
    @CurrentUser() user: any,
    @Param('id') reviewId: string,
  ) {
    await this.reviewsService.deleteReview(user.id, reviewId, user.role);
    return { success: true, message: 'Review deleted' };
  }
}

