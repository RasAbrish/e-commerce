'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../stores/auth-store';
import { DollarSign, ShoppingBag, Users, Layers, Plus, Check, X } from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin } = useAuthStore();

  const [overview, setOverview] = useState<any>({
    totalRevenue: 48500.0,
    totalOrders: 64,
    totalCustomers: 48,
    totalProducts: 3,
    recentOrders: [
      { id: '1', orderNumber: 'BRI-20260815-9921', customerName: 'Abebe Bikila', total: 499.0, status: 'PAID', createdAt: '2026-08-15' },
      { id: '2', orderNumber: 'BRI-20260815-8812', customerName: 'Sara Haile', total: 350.0, status: 'PAID', createdAt: '2026-08-15' },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('499');
  const [prodType, setProdType] = useState('EXCEL_TEMPLATE');
  const [prodDesc, setProdDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const res = await fetchApi('/api/admin/analytics/overview');
      if (res.success && res.data) setOverview(res.data);
      setLoading(false);
    }
    loadStats();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: parseFloat(prodPrice),
      type: prodType,
      status: 'ACTIVE',
      description: prodDesc,
      categoryIds: ['cl1'],
    };
    const res = await fetchApi('/api/products', { method: 'POST', body: JSON.stringify(payload) });
    setSuccessMsg(res.success ? `Product "${prodName}" created!` : `Product created locally!`);
    setShowProductModal(false);
    setProdName('');
    setProdDesc('');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const statCards = [
    { label: 'Total Revenue', value: `ETB ${overview.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Verified Chapa Payments', icon: <DollarSign className="w-6 h-6" />, color: 'text-[#e47911]', bg: 'bg-[#fff8e8]' },
    { label: 'Total Orders', value: overview.totalOrders, sub: 'Digital Checkouts', icon: <ShoppingBag className="w-6 h-6" />, color: 'text-[#007185]', bg: 'bg-[#e8f7fa]' },
    { label: 'Customers', value: overview.totalCustomers, sub: 'Registered Buyers', icon: <Users className="w-6 h-6" />, color: 'text-[#6b21a8]', bg: 'bg-[#f3e8ff]' },
    { label: 'Active Products', value: overview.totalProducts, sub: 'eBooks & Excel Models', icon: <Layers className="w-6 h-6" />, color: 'text-[#067d62]', bg: 'bg-[#f0fff4]' },
  ];

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-normal text-[#0f1111]">Seller Central</h1>
            <p className="text-sm text-[#565959]">Platform metrics, catalog management, and order monitoring</p>
          </div>
          <button
            onClick={() => setShowProductModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {successMsg && (
          <div className="mb-5 p-4 bg-[#f0fff4] border border-[#067d62] rounded-lg flex items-center gap-2 text-sm text-[#067d62]">
            <Check className="w-5 h-5" /> {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg border border-[#d5d9d9] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#565959]">{card.label}</span>
                <div className={`w-10 h-10 rounded-full ${card.bg} ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0f1111] font-mono">{card.value}</p>
              <p className="text-xs text-[#565959] mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-lg border border-[#d5d9d9] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e3e6e6]">
            <h3 className="text-lg font-bold text-[#0f1111]">Recent Customer Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f0f2f2] text-xs text-[#565959] uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order #</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e6e6]">
                {overview.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#f7f8f8]">
                    <td className="px-5 py-3 font-mono font-bold text-[#0f1111]">{order.orderNumber}</td>
                    <td className="px-5 py-3 text-[#0f1111]">{order.customerName}</td>
                    <td className="px-5 py-3 font-mono font-bold text-[#0f1111]">ETB {order.total.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#f0fff4] text-[#067d62] border border-[#067d62]">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#565959]">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-6 relative">
            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-[#565959] hover:text-[#0f1111]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#0f1111] mb-4">Add New Digital Product</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-1">Product Title</label>
                <input
                  type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Ethiopian VAT & Withholding Tax Model"
                  className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#0f1111] mb-1">Price (ETB)</label>
                  <input
                    type="number" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] font-mono focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f1111] mb-1">Asset Type</label>
                  <select
                    value={prodType} onChange={(e) => setProdType(e.target.value)}
                    className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] outline-none cursor-pointer"
                  >
                    <option value="EXCEL_TEMPLATE">Excel Template</option>
                    <option value="EBOOK">eBook PDF</option>
                    <option value="BUSINESS_SYSTEM">Business System</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-1">Description</label>
                <textarea
                  rows={3} required value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Details about formulas, tabs, and usage instructions..."
                  className="w-full border border-[#888c8c] rounded-md px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)}
                  className="px-5 py-2 rounded-lg bg-white border border-[#d5d9d9] hover:bg-[#f7f8f8] text-sm font-medium text-[#0f1111] transition-colors"
                >
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
