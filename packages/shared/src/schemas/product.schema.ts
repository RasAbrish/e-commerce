import { z } from 'zod';

export const productTypeEnum = z.enum([
  'EBOOK',
  'EXCEL_TEMPLATE',
  'BUSINESS_SYSTEM',
  'COURSE',
  'OTHER',
]);

export const productStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']);

export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional().nullable(),
  currency: z.string().default('ETB'),
  type: productTypeEnum,
  status: productStatusEnum.default('DRAFT'),
  isFeatured: z.boolean().default(false),
  categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  type: productTypeEnum.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'price', 'name', 'totalSales', 'averageRating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
