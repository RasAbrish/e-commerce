import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100).optional(),
  comment: z.string().min(5).max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
