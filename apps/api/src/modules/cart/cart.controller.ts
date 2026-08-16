import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@CurrentUser('id') userId: string) {
    const cart = await this.cartService.getCart(userId);
    return { success: true, data: cart };
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  async addItem(
    @CurrentUser('id') userId: string,
    @Body('productId') productId: string,
  ) {
    const item = await this.cartService.addItem(userId, productId);
    return { success: true, data: item };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id')
  async updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    const item = await this.cartService.updateItem(userId, itemId, quantity);
    return { success: true, data: item };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:id')
  async removeItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    const result = await this.cartService.removeItem(userId, itemId);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async clearCart(@CurrentUser('id') userId: string) {
    const result = await this.cartService.clearCart(userId);
    return { success: true, data: result };
  }
}
