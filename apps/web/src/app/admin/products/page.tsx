'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const res = await fetchApi<any[]>('/api/products');
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Product Catalog</h1>
          <p className="text-sm text-gray-500">Manage all digital products, prices, and status.</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or slug..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm text-[#0f1111] focus:outline-none focus:ring-2 focus:ring-[#febd69]"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredProducts.length} products
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Product Name</th>
              <th className="px-6 py-3.5">Type</th>
              <th className="px-6 py-3.5">Price</th>
              <th className="px-6 py-3.5">Sales</th>
              <th className="px-6 py-3.5">Rating</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#0f1111] max-w-xs truncate">
                    <Link href={`/products/${product.slug}`} className="hover:text-[#c7511f] hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">
                    {product.type}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#0f1111]">
                    {formatCurrency(Number(product.price))}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                    {product.totalSales || 0}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-yellow-600">
                    ★ {Number(product.averageRating || 0).toFixed(1)} ({product.totalReviews || 0})
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-[#007185] hover:text-[#c7511f] font-semibold text-xs hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
