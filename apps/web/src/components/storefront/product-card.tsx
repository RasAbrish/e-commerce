'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '../../stores/cart-store';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    currency?: string;
    type: string;
    averageRating: number;
    totalReviews: number;
    images?: { url: string; altText?: string }[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCartStore();
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800';
  const isInCart = items.some((i) => i.id === product.id);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EXCEL_TEMPLATE': return 'Excel Template';
      case 'EBOOK': return 'eBook (PDF)';
      case 'BUSINESS_SYSTEM': return 'Business System';
      default: return 'Digital Product';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#d5d9d9] hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col group">
      {/* Image — Entire area is a link */}
      <Link href={`/products/${product.slug}`} className="block relative bg-[#f7f8f8] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {discount && (
          <div className="absolute top-0 left-0 bg-[#cc0c39] text-white text-xs font-bold px-2.5 py-1">
            {discount}% off
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-sm font-medium text-[#0f1111] leading-snug line-clamp-2 hover:text-[#c7511f] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating) ? 'text-[#e47911] fill-current' : 'text-[#d5d9d9] fill-current'}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <Link href={`/products/${product.slug}`} className="text-xs text-[#007185] hover:text-[#c7511f]">
            {product.totalReviews > 0 ? product.totalReviews : 8}
          </Link>
        </div>

        {/* Type Badge */}
        <span className="text-[11px] text-[#565959] mt-1.5">{getTypeLabel(product.type)}</span>

        {/* Price */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-[#565959] relative -top-[5px]">ETB</span>
            <span className="text-xl font-bold text-[#0f1111]">{Math.floor(product.price)}</span>
            <span className="text-xs text-[#0f1111] relative -top-[5px]">{(product.price % 1).toFixed(2).substring(1)}</span>
          </div>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="text-xs text-[#565959] mt-0.5">
              List: <span className="line-through">ETB {product.compareAtPrice.toFixed(2)}</span>
            </div>
          )}
          <p className="text-xs text-[#007185] mt-1 font-medium">Instant digital delivery</p>
        </div>

        {/* Add to Cart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: primaryImage,
            });
          }}
          className={`mt-3 w-full py-2 rounded-full text-xs font-bold transition-colors ${
            isInCart
              ? 'bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111]'
              : 'bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111]'
          }`}
        >
          {isInCart ? '✓ In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
