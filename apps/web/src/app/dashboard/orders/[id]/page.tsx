'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CustomerSidebarNav } from '@/components/customer/sidebar-nav';
import { fetchApi } from '@/lib/api';
import { formatCurrency, formatDate, formatOrderNumber } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { ArrowLeft, Package, Download } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      const res = await fetchApi<any>(`/api/orders/${orderId}`);
      if (res.success && res.data) {
        setOrder(res.data);
      }
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#e3e6e6] min-h-screen py-8">
        <div className="max-w-[1400px] mx-auto px-4 text-center py-12 text-gray-500">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#e3e6e6] min-h-screen py-8">
        <div className="max-w-[1400px] mx-auto px-4 text-center py-12 text-gray-500">
          Order not found.
        </div>
      </div>
    );
  }

  const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || {
    label: order.status,
    color: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <CustomerSidebarNav />

          <main className="flex-1 space-y-6">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Orders</span>
            </Link>

            {/* Order Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h1 className="text-2xl font-bold text-[#0f1111]">
                    Order {formatOrderNumber(order.orderNumber)}
                  </h1>
                  <p className="text-xs text-[#565959] mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-gray-500 block">Payment Method</span>
                  <span className="font-bold text-[#0f1111]">{order.paymentProvider || 'Chapa Gateway'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Customer</span>
                  <span className="font-bold text-[#0f1111]">{order.customerFirstName} {order.customerLastName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Subtotal</span>
                  <span className="font-bold text-[#0f1111]">{formatCurrency(order.subtotal || order.total)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Grand Total</span>
                  <span className="font-bold text-lg text-[#0f1111]">{formatCurrency(order.totalAmount || order.total)}</span>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-[#0f1111]">Purchased Digital Items</h3>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gray-100 rounded-lg">
                        <Package className="w-6 h-6 text-[#febd69]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0f1111] text-sm">
                          {item.productName || item.product?.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-mono">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                      <span className="font-bold text-[#0f1111] text-base">
                        {formatCurrency(item.productPrice || item.price)}
                      </span>
                      {order.status === 'PAID' && (
                        <Link
                          href="/dashboard/downloads"
                          className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-xs rounded transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
