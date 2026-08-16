import { z } from 'zod';

export const discountTypeEnum = z.enum(['PERCENTAGE', 'FIXED_AMOUNT']);

export const createCouponSchema = z.object({
  code: z.string().min(3).transform((val) => val.toUpperCase()),
  discountType: discountTypeEnum,
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1),
  orderAmount: z.number().nonnegative(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
