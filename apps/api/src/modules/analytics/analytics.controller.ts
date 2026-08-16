import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard() {
    const overview = await this.analyticsService.getAdminOverview();
    return { success: true, data: overview };
  }

  // Keep the old endpoint for backward compatibility
  @Get('analytics/overview')
  async getOverview() {
    const overview = await this.analyticsService.getAdminOverview();
    return { success: true, data: overview };
  }

  @Get('analytics/revenue')
  async getRevenueOverTime(@Query('period') period?: string) {
    const revenue = await this.analyticsService.getRevenueOverTime(period || '30d');
    return { success: true, data: revenue };
  }

  @Get('analytics/products')
  async getTopProducts(@Query('limit') limit?: string) {
    const products = await this.analyticsService.getTopProducts(Number(limit) || 10);
    return { success: true, data: products };
  }

  @Get('orders')
  async getAllOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.analyticsService.getAllOrders(
      Number(page) || 1,
      Number(limit) || 20,
      status,
      search,
    );
    return { success: true, data: result.orders, meta: result.meta };
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: string,
  ) {
    const order = await this.analyticsService.updateOrderStatus(orderId, status);
    return { success: true, data: order };
  }
}

