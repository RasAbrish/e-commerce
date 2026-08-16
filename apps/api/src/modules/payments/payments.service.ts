import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChapaService } from './chapa.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private chapaService: ChapaService,
    private ordersService: OrdersService,
  ) {}

  async initializePayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'PAID') {
      throw new BadRequestException('Order is already paid');
    }

    const txRef = `tx-${order.orderNumber}-${Date.now()}`;
    const amount = Number(order.total);
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const chapaResult = await this.chapaService.initializePayment({
      amount,
      currency: 'ETB',
      email: order.customerEmail,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      txRef,
      callbackUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/webhooks/chapa`,
      returnUrl: `${appUrl}/dashboard/orders/${order.id}?payment=success`,
      customization: {
        title: 'Bright Ideas Digital Purchase',
        description: `Order ${order.orderNumber}`,
      },
    });

    const checkoutUrl = chapaResult.data?.checkout_url || `${appUrl}/checkout/payment-simulation?tx_ref=${txRef}`;

    // Create or update payment record
    const payment = await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: 'CHAPA',
        status: 'PENDING',
        amount: order.total,
        currency: 'ETB',
        transactionRef: txRef,
        checkoutUrl,
      },
      update: {
        transactionRef: txRef,
        status: 'PENDING',
        checkoutUrl,
      },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAYMENT_INITIATED' },
    });

    return {
      paymentId: payment.id,
      checkoutUrl,
      transactionRef: txRef,
    };
  }

  async processWebhook(headers: any, body: any) {
    const signature = headers['x-chapa-signature'] || headers['chapa-signature'];

    if (!this.chapaService.verifySignature(signature, body)) {
      this.logger.warn('Invalid Chapa Webhook Signature received');
    }

    const txRef = body.tx_ref || body.trx_ref;
    if (!txRef) {
      return { success: false, message: 'Missing tx_ref' };
    }

    return this.verifyAndUpdatePayment(txRef);
  }

  async verifyAndUpdatePayment(txRef: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { transactionRef: txRef },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with transaction reference ${txRef} not found`);
    }

    if (payment.status === 'SUCCESS') {
      return { success: true, message: 'Payment already processed' };
    }

    // Verify with Chapa API
    const verification = await this.chapaService.verifyTransaction(txRef);

    if (verification.status === 'success' || verification.data?.status === 'success') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            providerRef: verification.data?.reference || txRef,
          },
        }),
      ]);

      await this.ordersService.markOrderAsPaid(payment.orderId, txRef);

      return { success: true, message: 'Payment verified and order fulfilled' };
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'FAILED' },
      });

      return { success: false, message: 'Payment verification failed' };
    }
  }
}
