import { Controller, Post, Get, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('payments/initialize')
  async initializePayment(
    @CurrentUser('id') userId: string,
    @Body('orderId') orderId: string,
  ) {
    const result = await this.paymentsService.initializePayment(orderId, userId);
    return { success: true, data: result };
  }

  @Post('webhooks/chapa')
  async handleChapaWebhook(@Headers() headers: any, @Body() body: any) {
    const result = await this.paymentsService.processWebhook(headers, body);
    return result;
  }

  @Get('payments/verify/:txRef')
  async verifyPayment(@Param('txRef') txRef: string) {
    const result = await this.paymentsService.verifyAndUpdatePayment(txRef);
    return { success: true, data: result };
  }
}
