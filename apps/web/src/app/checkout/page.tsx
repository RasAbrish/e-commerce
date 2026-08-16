'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../stores/cart-store';
import { useAuthStore } from '../../stores/auth-store';
import { fetchApi } from '../../lib/api';
import { Lock, ChevronRight, ArrowRight, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, discountAmount, couponCode, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '+251911223344');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!email) setEmail(user.email);
      if (!firstName) setFirstName(user.firstName);
      if (!lastName) setLastName(user.lastName);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-[#0f1111]">Your cart is empty</h2>
          <p className="text-sm text-[#565959] mt-2">Add products to your cart before checkout.</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 px-8 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderRes = await fetchApi('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        couponCode: couponCode || undefined,
        customerEmail: email, customerFirstName: firstName, customerLastName: lastName, customerPhone: phone,
        paymentProvider: 'CHAPA',
      }),
    });

    if (!orderRes.success || !orderRes.data) {
      setLoading(false);
      setError(orderRes.error || 'Failed to create order.');
      return;
    }

    const paymentRes = await fetchApi('/api/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({ orderId: orderRes.data.id }),
    });

    setLoading(false);
    if (paymentRes.success && paymentRes.data?.checkoutUrl) {
      clearCart();
      window.location.href = paymentRes.data.checkoutUrl;
    } else {
      setError(paymentRes.error || 'Failed to initialize Chapa payment.');
    }
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      {/* Checkout Header */}
      <div className="bg-white border-b border-[#d5d9d9] shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-[28px] font-normal text-[#0f1111]">Checkout</h1>
          <div className="flex items-center gap-1 text-xs text-[#565959]">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Checkout via Chapa</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contact Info */}
              <div className="bg-white rounded-lg border border-[#d5d9d9] p-6">
                <h2 className="text-lg font-bold text-[#0f1111] mb-4 pb-3 border-b border-[#e3e6e6]">
                  1. Customer Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0f1111] mb-1">First name</label>
                      <input
                        type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0f1111] mb-1">Last name</label>
                      <input
                        type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0f1111] mb-1">Email (for download link)</label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0f1111] mb-1">Ethiopian phone number</label>
                    <input
                      type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251911223344"
                      className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] font-mono focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg border border-[#d5d9d9] p-6">
                <h2 className="text-lg font-bold text-[#0f1111] mb-4 pb-3 border-b border-[#e3e6e6]">
                  2. Payment Method
                </h2>
                <div className="flex items-center gap-4 p-4 border border-[#e47911] rounded-lg bg-[#fff8e8]">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-[#e47911]" />
                    <span className="text-sm font-bold text-[#0f1111]">Chapa Payment Gateway</span>
                  </div>
                  <span className="text-xs text-[#565959]">Telebirr • CBE Birr • Awash Birr • Cards</span>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-[#fef2f2] border border-[#fca5a5] rounded-lg text-sm text-[#b91c1c]">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-[#d5d9d9] p-6">
              <button
                onClick={handleSubmit as any}
                disabled={loading}
                className="w-full py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors disabled:opacity-50 mb-4"
              >
                {loading ? 'Processing...' : 'Place your order'}
              </button>
              <p className="text-xs text-[#565959] text-center mb-4">
                By placing your order, you agree to Bright Ideas&apos; conditions of use and privacy notice.
              </p>

              <hr className="border-[#e3e6e6] mb-4" />

              <h3 className="text-base font-bold text-[#0f1111] mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#0f1111]">
                  <span>Items ({items.reduce((a, i) => a + i.quantity, 0)}):</span>
                  <span>ETB {getSubtotal().toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#007600]">
                    <span>Discount ({couponCode}):</span>
                    <span>-ETB {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#0f1111]">
                  <span>Delivery:</span>
                  <span className="text-[#007600]">ETB 0.00 (Digital)</span>
                </div>
              </div>

              <hr className="border-[#e3e6e6] my-3" />

              <div className="flex justify-between text-lg font-bold text-[#cc0c39]">
                <span>Order total:</span>
                <span>ETB {getTotal().toFixed(2)}</span>
              </div>

              {/* Item list */}
              <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border border-[#d5d9d9]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0f1111] font-medium truncate">{item.name}</p>
                      <p className="text-[#565959]">Qty: {item.quantity} • ETB {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
