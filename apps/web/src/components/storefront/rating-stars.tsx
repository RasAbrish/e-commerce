'use client';

import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingStars({ rating, totalReviews, size = 'md', showCount = true }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= Math.floor(rating)
                ? 'fill-[#FFA41C] text-[#FFA41C]'
                : star <= Math.ceil(rating) && rating % 1 >= 0.5
                ? 'fill-[#FFA41C]/50 text-[#FFA41C]'
                : 'fill-gray-200 text-gray-200',
            )}
          />
        ))}
      </div>
      {rating > 0 && (
        <span className={cn(textClasses[size], 'text-[#007185] font-medium')}>
          {rating.toFixed(1)}
        </span>
      )}
      {showCount && totalReviews !== undefined && (
        <span className={cn(textClasses[size], 'text-[#565959]')}>
          ({totalReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}
