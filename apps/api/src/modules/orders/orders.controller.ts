import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@CurrentUser('id') userId: string, @Body() body: any) {
    const order = await this.ordersService.createOrder(userId, body);
    return { success: true, data: order };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserOrders(@CurrentUser('id') userId: string) {
    const orders = await this.ordersService.getUserOrders(userId);
    return { success: true, data: orders };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrderById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const order = await this.ordersService.getOrderById(id, userId);
    return { success: true, data: order };
  }
}
