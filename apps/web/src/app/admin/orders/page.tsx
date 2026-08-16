'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatCurrency, formatDate, formatOrderNumber } from '@/lib/format';
import { ORDER_STATUSES } from '@/lib/constants';
import { Search, Eye, Filter } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetchApi<any>(`/api/admin/orders?${params.toString()}`);
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setLoading(false);
    }
    loadOrders();
  }, [search, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const res = await fetchApi(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1111]">Order Management</h1>
        <p className="text-sm text-gray-500">Monitor transactions, update statuses, and verify payments.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm text-[#0f1111] focus:outline-none focus:ring-2 focus:ring-[#febd69]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md text-sm text-[#0f1111] bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Order Number</th>
              <th className="px-6 py-3.5">Customer</th>
              <th className="px-6 py-3.5">Total Amount</th>
              <th className="px-6 py-3.5">Payment</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || {
                  label: order.status,
                  color: 'bg-gray-100 text-gray-800',
                };
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#0f1111]">
                      {formatOrderNumber(order.orderNumber)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0f1111]">
                        {order.customerFirstName} {order.customerLastName}
                      </div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0f1111]">
                      {formatCurrency(Number(order.total || order.totalAmount))}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      {order.paymentProvider || 'CHAPA'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="py-1 px-2 border border-gray-300 rounded text-xs font-semibold text-[#0f1111] bg-white focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
