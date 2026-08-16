import { z } from 'zod';

export const paymentProviderEnum = z.enum(['CHAPA', 'TELEBIRR', 'BANK_TRANSFER']);

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
  customerEmail: z.string().email(),
  customerFirstName: z.string().min(1),
  customerLastName: z.string().min(1),
  customerPhone: z.string().optional(),
  paymentProvider: paymentProviderEnum.default('CHAPA'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
