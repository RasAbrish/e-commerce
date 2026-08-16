export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PRODUCT_TYPES = {
  EBOOK: 'eBook',
  EXCEL_TEMPLATE: 'Excel Template',
  BUSINESS_SYSTEM: 'Business System',
  COURSE: 'Course',
  OTHER: 'Other',
} as const;

export const ORDER_STATUSES = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  PAYMENT_INITIATED: { label: 'Payment Started', color: 'bg-blue-100 text-blue-800' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
} as const;

export const PAYMENT_STATUSES = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  SUCCESS: { label: 'Success', color: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
} as const;

export const CURRENCY = 'ETB';
export const SITE_NAME = 'Bright Ideas';
export const SITE_DESCRIPTION = 'Digital Products for Ethiopian Business';
