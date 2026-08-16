import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { registerSchema, loginSchema } from '@bright-ideas/shared';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const validated = registerSchema.parse(body);
    const result = await this.authService.register(validated);
    return { success: true, data: result };
  }

  @Post('login')
  async login(@Body() body: any) {
    const validated = loginSchema.parse(body);
    const result = await this.authService.login(validated);
    return { success: true, data: result };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser('id') userId: string) {
    await this.authService.logout(userId);
    return { success: true, message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const result = await this.authService.forgotPassword(email);
    return { success: true, data: result };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const result = await this.authService.resetPassword(body.token, body.newPassword);
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    return { success: true, data: this.authService.sanitizeUser(user) };
  }
}

