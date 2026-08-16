'use client';

import Link from 'next/link';
import { Package, ChevronRight, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, formatOrderNumber } from '../../lib/format';
import { ORDER_STATUSES } from '../../lib/constants';

interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
    totalAmount?: number;
    total?: number;
    status: string;
    items: Array<{
      id: string;
      productName?: string;
      productPrice?: number;
      price?: number;
      quantity: number;
      product?: { name: string; slug: string };
    }>;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const total = order.totalAmount ?? order.total ?? 0;
  const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || {
    label: order.status,
    color: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-[#565959]">
        <div className="flex items-center gap-6">
          <div>
            <span className="block text-gray-500 font-medium">ORDER PLACED</span>
            <span className="font-semibold text-[#0f1111]">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">TOTAL</span>
            <span className="font-semibold text-[#0f1111]">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-gray-600">{formatOrderNumber(order.orderNumber)}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-5 space-y-3">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#febd69] shrink-0" />
              <span className="font-medium text-[#0f1111]">
                {item.productName || item.product?.name || 'Digital Item'}
              </span>
              {item.quantity > 1 && (
                <span className="text-xs text-gray-500">x{item.quantity}</span>
              )}
            </div>
            <span className="font-bold text-[#0f1111]">
              {formatCurrency(item.productPrice ?? item.price ?? 0)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions Footer */}
      <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs">
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="text-[#007185] hover:text-[#c7511f] font-semibold flex items-center gap-1 hover:underline"
        >
          <span>View Order Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {order.status === 'PAID' && (
          <Link
            href="/dashboard/downloads"
            className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold rounded text-xs transition-colors"
          >
            Access Downloads
          </Link>
        )}
      </div>
    </div>
  );
}
