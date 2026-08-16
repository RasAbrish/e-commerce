'use client';

import { formatCurrency, formatDiscount } from '../../lib/format';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}

export function PriceDisplay({ price, compareAtPrice, size = 'md', showSavings = true }: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discount = hasDiscount ? formatDiscount(compareAtPrice!, price) : '';

  const sizeClasses = {
    sm: { price: 'text-lg font-bold', original: 'text-sm', badge: 'text-xs px-1.5 py-0.5' },
    md: { price: 'text-2xl font-bold', original: 'text-base', badge: 'text-sm px-2 py-0.5' },
    lg: { price: 'text-3xl font-bold', original: 'text-lg', badge: 'text-base px-2.5 py-1' },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`${classes.price} text-[#0f1111]`}>
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <>
          <span className={`${classes.original} text-[#565959] line-through`}>
            {formatCurrency(compareAtPrice!)}
          </span>
          {showSavings && discount && (
            <span className={`${classes.badge} bg-[#CC0C39] text-white rounded-sm font-medium`}>
              {discount}
            </span>
          )}
        </>
      )}
    </div>
  );
}
