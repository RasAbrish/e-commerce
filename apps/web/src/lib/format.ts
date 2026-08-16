import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a number as Ethiopian Birr currency.
 */
export function formatCurrency(amount: number): string {
  return `ETB ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculate discount percentage between original and sale price.
 */
export function formatDiscount(originalPrice: number, salePrice: number): string {
  if (!originalPrice || originalPrice <= salePrice) return '';
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  return `${discount}% off`;
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

/**
 * Format a date as relative time (e.g., "2 hours ago").
 */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format a date to include time.
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

/**
 * Format file size in human-readable format.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format an order number for display.
 */
export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber}`;
}
