import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface ChapaInitializeOptions {
  amount: number;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  customization?: {
    title?: string;
    description?: string;
  };
}

@Injectable()
export class ChapaService {
  private readonly logger = new Logger(ChapaService.name);
  private readonly secretKey = process.env.CHAPA_SECRET_KEY || 'CHASECK-TEST-mock-secret-key-12345';
  private readonly baseUrl = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';

  async initializePayment(options: ChapaInitializeOptions) {
    this.logger.log(`Initializing Chapa transaction: ${options.txRef} for ${options.amount} ${options.currency}`);

    // If using mock mode or sandbox key
    if (this.secretKey.includes('mock') || process.env.NODE_ENV === 'test') {
      const mockCheckoutUrl = `${process.env.APP_URL || 'http://localhost:3000'}/checkout/payment-simulation?tx_ref=${options.txRef}&amount=${options.amount}`;
      return {
        status: 'success',
        message: 'Hosted Link created',
        data: {
          checkout_url: mockCheckoutUrl,
        },
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: options.amount.toString(),
          currency: options.currency,
          email: options.email,
          first_name: options.firstName,
          last_name: options.lastName,
          tx_ref: options.txRef,
          callback_url: options.callbackUrl,
          return_url: options.returnUrl,
          customization: options.customization,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Chapa initialization failed', error);
      throw error;
    }
  }

  async verifyTransaction(txRef: string) {
    this.logger.log(`Verifying Chapa transaction: ${txRef}`);

    if (this.secretKey.includes('mock') || process.env.NODE_ENV === 'test') {
      return {
        status: 'success',
        message: 'Payment details verified',
        data: {
          tx_ref: txRef,
          status: 'success',
          currency: 'ETB',
        },
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${txRef}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Chapa verification failed', error);
      throw error;
    }
  }

  verifySignature(signature: string, body: any): boolean {
    if (!signature) return false;
    const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET || 'mock-webhook-secret-hash';
    const hash = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    return signature === hash || process.env.NODE_ENV === 'development' || this.secretKey.includes('mock');
  }
}
