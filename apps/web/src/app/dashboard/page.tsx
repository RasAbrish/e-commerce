'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../stores/auth-store';
import { Download, Package, Search, ChevronRight, Check } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const [purchasedFiles, setPurchasedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingToken, setDownloadingToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'downloads'>('orders');

  const fallbackFiles = [
    {
      fileId: 'f1', fileName: 'Ethiopian_Payroll_Tax_Calculator_2026.xlsx', fileSize: 2450000,
      mimeType: 'Excel Sheet', productName: 'Ethiopian Tax & Payroll Excel Calculator (2026 Edition)',
      orderId: 'ord-123', orderNumber: 'BRI-20260815-9921',
      purchasedAt: '2026-08-15T10:30:00Z', status: 'Delivered', price: 499.0,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200',
    },
    {
      fileId: 'f2', fileName: 'Ethiopian_Startup_Handbook.pdf', fileSize: 8900000,
      mimeType: 'PDF Document', productName: 'The Ethiopian Startup Handbook: 0 to 1 Million ETB',
      orderId: 'ord-124', orderNumber: 'BRI-20260815-8812',
      purchasedAt: '2026-08-14T14:00:00Z', status: 'Delivered', price: 350.0,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200',
    },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const filesRes = await fetchApi('/api/downloads/my-files');
      if (filesRes.success && filesRes.data?.length > 0) {
        setPurchasedFiles(filesRes.data);
      } else {
        setPurchasedFiles(fallbackFiles);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDownload = async (orderId: string, fileId: string) => {
    setDownloadingToken(fileId);
    const res = await fetchApi(`/api/downloads/token/${orderId}/${fileId}`, { method: 'POST' });
    setDownloadingToken(null);
    if (res.success && res.data?.downloadUrl) {
      window.open(res.data.downloadUrl, '_blank');
    } else {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      window.open(`${API_BASE}/api/downloads/file/mock-token-sample`, '_blank');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const tabs = [
    { key: 'orders', label: 'Orders' },
    { key: 'downloads', label: 'Digital Downloads' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#007185] mb-4">
          <Link href="/" className="hover:text-[#c7511f] hover:underline">Bright Ideas</Link>
          <ChevronRight className="w-3 h-3 text-[#999]" />
          <Link href="/profile" className="hover:text-[#c7511f] hover:underline">Your Account</Link>
          <ChevronRight className="w-3 h-3 text-[#999]" />
          <span className="text-[#565959]">Your Orders</span>
        </nav>

        <h1 className="text-[28px] font-normal text-[#0f1111] mb-4">Your Orders</h1>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-[#e3e6e6] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#e47911] text-[#e47911]'
                  : 'border-transparent text-[#565959] hover:text-[#0f1111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Orders */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search all orders"
              className="w-full bg-white text-sm text-[#0f1111] pl-10 pr-4 py-2.5 rounded-md border border-[#888c8c] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#555]" />
          </div>
          <button className="px-5 py-2.5 rounded-lg bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] text-sm text-[#0f1111] font-medium shadow-sm transition-colors">
            Search Orders
          </button>
        </div>

        <p className="text-sm text-[#0f1111] mb-4 font-bold">{purchasedFiles.length} orders placed</p>

        {loading ? (
          <div className="text-center py-16 text-sm text-[#565959]">Loading your orders...</div>
        ) : purchasedFiles.length === 0 ? (
          <div className="text-center py-16 border border-[#d5d9d9] rounded-lg">
            <Package className="w-12 h-12 text-[#d5d9d9] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0f1111]">No orders yet</h3>
            <p className="text-sm text-[#565959] mt-1">Your purchased digital products will appear here.</p>
            <Link href="/products" className="mt-4 inline-block px-6 py-2 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {purchasedFiles.map((file) => (
              <div key={file.fileId} className="border border-[#d5d9d9] rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-[#f0f2f2] px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#565959] border-b border-[#d5d9d9]">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <span className="uppercase text-[11px] font-semibold block">Order Placed</span>
                      <span className="text-[#0f1111]">{formatDate(file.purchasedAt)}</span>
                    </div>
                    <div>
                      <span className="uppercase text-[11px] font-semibold block">Total</span>
                      <span className="text-[#0f1111]">ETB {(file.price || 499).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="uppercase text-[11px] font-semibold block">Ship To</span>
                      <span className="text-[#007185]">{user?.firstName || 'Abebe'} {user?.lastName || 'Bikila'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="uppercase text-[11px] font-semibold block">Order # {file.orderNumber}</span>
                    <Link href={`/dashboard/orders/${file.orderId}`} className="text-[#007185] hover:text-[#c7511f] hover:underline">
                      View order details
                    </Link>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-5 flex flex-col sm:flex-row items-start gap-5">
                  {/* Product Thumbnail */}
                  <img
                    src={file.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200'}
                    alt={file.productName}
                    className="w-24 h-24 object-cover rounded-md border border-[#d5d9d9] flex-shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-1 mb-1">
                      <span className="text-sm font-bold text-[#007600]">{file.status || 'Delivered'}</span>
                      <Check className="w-4 h-4 text-[#007600]" />
                    </div>
                    <h4 className="text-sm font-medium text-[#007185] hover:text-[#c7511f] cursor-pointer">
                      {file.productName}
                    </h4>
                    <p className="text-xs text-[#565959] mt-1 font-mono">
                      {file.fileName} • {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownload(file.orderId, file.fileId)}
                      disabled={downloadingToken === file.fileId}
                      className="w-full sm:w-48 py-2 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-medium text-[#0f1111] transition-colors disabled:opacity-50"
                    >
                      {downloadingToken === file.fileId ? 'Generating...' : 'Download Again'}
                    </button>
                    <Link
                      href={`/dashboard/orders/${file.orderId}`}
                      className="w-full sm:w-48 py-2 rounded-lg bg-white border border-[#d5d9d9] hover:bg-[#f7f8f8] text-sm font-medium text-[#0f1111] text-center transition-colors"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
