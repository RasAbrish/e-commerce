'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { BarChart3, Package, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      const [overviewRes, revenueRes, productsRes] = await Promise.all([
        fetchApi('/api/admin/analytics/overview'),
        fetchApi<any[]>('/api/admin/analytics/revenue?period=30d'),
        fetchApi<any[]>('/api/admin/analytics/products?limit=5'),
      ]);
      if (overviewRes.success) setOverview(overviewRes.data);
      if (revenueRes.success && revenueRes.data) setRevenue(revenueRes.data);
      if (productsRes.success && productsRes.data) setProducts(productsRes.data);
      setLoading(false);
    }
    loadAnalytics();
  }, []);

  const totalRevenue = revenue.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const maxRevenue = Math.max(...revenue.map((item) => Number(item.revenue || 0)), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1111]">Analytics</h1>
        <p className="text-sm text-gray-500">Monitor sales, revenue, and top-performing digital products.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: '30 Day Revenue', value: formatCurrency(totalRevenue || overview?.totalRevenue || 0), icon: TrendingUp },
          { label: 'Orders', value: overview?.totalOrders || 0, icon: ShoppingBag },
          { label: 'Customers', value: overview?.totalCustomers || 0, icon: BarChart3 },
          { label: 'Active Products', value: overview?.activeProducts || overview?.totalProducts || 0, icon: Package },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{card.label}</span>
                <div className="w-10 h-10 rounded-full bg-[#fff8e8] text-[#e47911] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0f1111]">{loading ? '...' : card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#0f1111]">Revenue Trend</h2>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-500">Loading analytics...</div>
          ) : revenue.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-500">No paid orders yet.</div>
          ) : (
            <div className="h-64 flex items-end gap-2 border-b border-gray-200 pt-4">
              {revenue.map((item) => (
                <div key={item.date} className="flex-1 min-w-0 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#febd69] rounded-t"
                    style={{ height: `${Math.max((Number(item.revenue || 0) / maxRevenue) * 210, 8)}px` }}
                    title={`${item.date}: ${formatCurrency(Number(item.revenue || 0))}`}
                  />
                  <span className="text-[10px] text-gray-500 truncate w-full text-center">{item.date.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-[#0f1111] mb-4">Top Products</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-500">No product sales yet.</p>
            ) : (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="block border border-gray-100 rounded-md p-3 hover:bg-gray-50">
                  <p className="text-sm font-bold text-[#0f1111] line-clamp-2">{product.name}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{product.totalSales || 0} sales</span>
                    <span className="font-bold text-[#0f1111]">{formatCurrency(Number(product.revenue || 0))}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
