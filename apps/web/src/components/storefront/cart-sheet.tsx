'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingCart, ArrowRight, Tag, Check } from 'lucide-react';
import { useCartStore } from '../../stores/cart-store';
import { fetchApi } from '../../lib/api';

export const CartSheet: React.FC = () => {
  const {
    items, isOpen, toggleCart, removeItem, updateQuantity,
    getSubtotal, getTotal, couponCode, discountAmount, setCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    const subtotal = getSubtotal();
    const res = await fetchApi('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: couponInput.trim(), orderAmount: subtotal }),
    });

    setLoading(false);
    if (res.success && res.data) {
      setCoupon(res.data.code, res.data.calculatedDiscount);
      setCouponSuccess(`Coupon applied! Saved ETB ${res.data.calculatedDiscount}`);
    } else {
      setCouponError(res.error || 'Invalid promo code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={toggleCart} />

      {/* Slide-in Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">

          {/* Header */}
          <div className="px-5 py-4 border-b border-[#d5d9d9] flex items-center justify-between bg-[#f0f2f2]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#232f3e]" />
              <h2 className="text-lg font-bold text-[#0f1111]">Shopping Cart</h2>
              <span className="text-xs bg-white text-[#565959] px-2 py-0.5 rounded-full border border-[#d5d9d9] font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={toggleCart}
              className="p-1.5 rounded-md text-[#565959] hover:text-[#0f1111] hover:bg-[#e3e6e6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingCart className="w-16 h-16 text-[#d5d9d9] mb-4" />
                <p className="text-base font-medium text-[#0f1111]">Your cart is empty</p>
                <p className="text-sm text-[#565959] max-w-xs mt-1">
                  Browse our digital tools and add items to your cart.
                </p>
                <button
                  onClick={toggleCart}
                  className="mt-5 px-6 py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#e3e6e6]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border border-[#d5d9d9] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-md bg-[#f0f2f2] flex items-center justify-center text-[#565959] text-xs font-bold flex-shrink-0">
                      DIGITAL
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#007185] leading-snug line-clamp-2">{item.name}</h4>
                    <p className="text-sm font-bold text-[#0f1111] mt-1">
                      ETB {item.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#007600] mt-0.5 font-medium">In Stock</p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#d5d9d9] rounded-lg shadow-sm bg-[#f0f2f2]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-sm text-[#0f1111] hover:bg-[#e3e6e6] rounded-l-lg transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-[#0f1111] border-x border-[#d5d9d9] bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-sm text-[#0f1111] hover:bg-[#e3e6e6] rounded-r-lg transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[#d5d9d9]">|</span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#d5d9d9] bg-white space-y-4">

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Gift card or promo code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full text-sm text-[#0f1111] pl-9 pr-3 py-2 rounded-md border border-[#888c8c] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                  />
                  <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#888c8c]" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] text-sm font-medium text-[#0f1111] shadow-sm transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-xs text-[#b91c1c]">{couponError}</p>}
              {couponSuccess && (
                <p className="text-xs text-[#007600] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> {couponSuccess}
                </p>
              )}

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#565959]">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="text-[#0f1111] font-medium">ETB {getSubtotal().toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#007600] font-medium">
                    <span>Discount ({couponCode})</span>
                    <span>−ETB {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#0f1111] pt-2 border-t border-[#e3e6e6]">
                  <span>Total</span>
                  <span>ETB {getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] shadow-sm transition-colors active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products"
                onClick={toggleCart}
                className="w-full flex items-center justify-center py-2.5 rounded-full bg-white hover:bg-[#f7f8f8] border border-[#d5d9d9] text-sm font-medium text-[#0f1111] shadow-sm transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
