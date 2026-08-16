import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post('validate')
  async validate(@Body() body: any) {
    const result = await this.couponsService.validateCoupon(body);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get()
  async findAll() {
    const coupons = await this.couponsService.findAll();
    return { success: true, data: coupons };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  async create(@Body() body: any) {
    const coupon = await this.couponsService.create(body);
    return { success: true, data: coupon };
  }
}
