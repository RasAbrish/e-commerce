'use client';

import Link from 'next/link';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: any[];
  title?: string;
  viewAllLink?: string;
  columns?: 2 | 3 | 4 | 5;
  showViewAll?: boolean;
}

export function ProductGrid({
  products,
  title,
  viewAllLink,
  columns = 4,
  showViewAll = false,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  };

  return (
    <section className="bg-white p-5 rounded-sm shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0f1111]">{title}</h2>
          {showViewAll && viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              See all deals →
            </Link>
          )}
        </div>
      )}
      <div className={`grid ${colClasses[columns]} gap-4`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
