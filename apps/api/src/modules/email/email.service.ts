import { Injectable, Logger } from '@nestjs/common';

export interface SendEmailPayload {
  to: string;
  subject: string;
  template: 'order_receipt' | 'password_reset' | 'welcome';
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(payload: SendEmailPayload): Promise<boolean> {
    // In development mode: log email output to console
    // In production mode: integration with SMTP / Nodemailer / Resend / AWS SES
    this.logger.log(`\n📧 Send Email to: ${payload.to}\nSubject: ${payload.subject}\nTemplate: ${payload.template}\nData: ${JSON.stringify(payload.context, null, 2)}\n`);

    return true;
  }

  async sendOrderConfirmation(to: string, orderNumber: string, total: number, downloadLink: string) {
    return this.sendEmail({
      to,
      subject: `Order Confirmation #${orderNumber} — Bright Ideas`,
      template: 'order_receipt',
      context: { orderNumber, total, downloadLink },
    });
  }

  async sendPasswordResetLink(to: string, resetUrl: string) {
    return this.sendEmail({
      to,
      subject: 'Password Reset Request — Bright Ideas',
      template: 'password_reset',
      context: { resetUrl },
    });
  }
}
