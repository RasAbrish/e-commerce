'use client';

import { useEffect } from 'react';
import { CustomerSidebarNav } from '@/components/customer/sidebar-nav';
import { ProductCard } from '@/components/storefront/product-card';
import { useWishlist } from '@/hooks/use-wishlist';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="bg-[#e3e6e6] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <CustomerSidebarNav />

          <main className="flex-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0f1111] flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  My Wishlist
                </h1>
                <p className="text-sm text-[#565959] mt-1">
                  Products you&apos;ve saved for later. Easily add them to your cart when you&apos;re ready.
                </p>
              </div>
              <span className="bg-gray-100 text-[#0f1111] font-bold text-sm px-3 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm">
                Loading your wishlist...
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm space-y-4">
                <Heart className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#0f1111]">Your Wishlist is Empty</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Explore our marketplace for Ethiopian Excel tools, eBooks, and business systems to save your favorites.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: any) => (
                  <ProductCard key={item.id} product={item.product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
