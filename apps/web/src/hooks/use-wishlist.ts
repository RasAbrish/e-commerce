'use client';

import { fetchApi } from '../lib/api';
import { useAuthStore } from '../stores/auth-store';
import { useState, useCallback } from 'react';

interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: any;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    const result = await fetchApi<WishlistItem[]>('/api/wishlist');
    if (result.success && result.data) {
      setItems(result.data);
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  const addToWishlist = async (productId: string) => {
    const result = await fetchApi('/api/wishlist/' + productId, { method: 'POST' });
    if (result.success) {
      await fetchWishlist();
    }
    return result;
  };

  const removeFromWishlist = async (productId: string) => {
    const result = await fetchApi('/api/wishlist/' + productId, { method: 'DELETE' });
    if (result.success) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    }
    return result;
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  return {
    items,
    isLoading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    count: items.length,
  };
}
