import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { updateProfileSchema } from '@bright-ideas/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    const profile = await this.usersService.getProfile(userId);
    return { success: true, data: profile };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(updateProfileSchema)) body: any,
  ) {
    const profile = await this.usersService.updateProfile(userId, body);
    return { success: true, data: profile };
  }

  // --- Admin endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('customers')
  async listCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAllCustomers(
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
    return { success: true, data: result.customers, meta: result.meta };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('customers/:id')
  async getCustomerDetail(@Param('id') id: string) {
    const customer = await this.usersService.getCustomerDetail(id);
    return { success: true, data: customer };
  }
}
