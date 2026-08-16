import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWishlist(@CurrentUser('id') userId: string) {
    const items = await this.wishlistService.getWishlist(userId);
    return { success: true, data: items };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async addToWishlist(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    const item = await this.wishlistService.addToWishlist(userId, productId);
    return { success: true, data: item };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async removeFromWishlist(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    const result = await this.wishlistService.removeFromWishlist(userId, productId);
    return { success: true, data: result };
  }
}
