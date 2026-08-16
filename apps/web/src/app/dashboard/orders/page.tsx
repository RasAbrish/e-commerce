'use client';

import { useEffect, useState } from 'react';
import { CustomerSidebarNav } from '@/components/customer/sidebar-nav';
import { OrderCard } from '@/components/customer/order-card';
import { fetchApi } from '@/lib/api';
import { ShoppingBag, PackageX } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const res = await fetchApi<any[]>('/api/orders');
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setLoading(false);
    }
    loadOrders();
  }, []);

  return (
    <div className="bg-[#e3e6e6] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <CustomerSidebarNav />

          <main className="flex-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0f1111] flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#febd69]" />
                  My Orders
                </h1>
                <p className="text-sm text-[#565959] mt-1">
                  View and manage all your past orders, payment receipts, and download access.
                </p>
              </div>
              <span className="bg-gray-100 text-[#0f1111] font-bold text-sm px-3 py-1 rounded-full">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm space-y-4">
                <PackageX className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#0f1111]">No Orders Placed Yet</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  When you purchase digital products on Bright Ideas, your order receipts will appear here.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
