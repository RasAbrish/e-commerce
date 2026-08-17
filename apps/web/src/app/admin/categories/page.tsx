'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { FolderTree, Plus, Search, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const loadCategories = async () => {
    setLoading(true);
    const res = await fetchApi<any[]>('/api/categories');
    if (res.success && res.data) setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filtered = categories.filter((category) =>
    `${category.name} ${category.slug}`.toLowerCase().includes(search.toLowerCase())
  );

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const res = await fetchApi('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        name,
        slug,
        description,
        sortOrder: Number(sortOrder) || 0,
        isActive: true,
      }),
    });

    if (res.success) {
      setShowModal(false);
      setName('');
      setDescription('');
      setSortOrder('0');
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Product Categories</h1>
          <p className="text-sm text-gray-500">Manage storefront categories and catalog grouping.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm text-[#0f1111] focus:outline-none focus:ring-2 focus:ring-[#febd69]"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">Showing {filtered.length} categories</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Slug</th>
              <th className="px-6 py-3.5">Products</th>
              <th className="px-6 py-3.5">Sort</th>
              <th className="px-6 py-3.5">Created</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading categories...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No categories found.</td>
              </tr>
            ) : (
              filtered.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f0f2f2] text-[#232f3e] flex items-center justify-center">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0f1111]">{category.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{category.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 font-bold text-[#0f1111]">{category.productCount || 0}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{category.sortOrder}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{formatDate(category.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                      {category.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-[#0f1111]">Add Category</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={createCategory} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Sort Order</label>
                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded font-semibold text-gray-700">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#febd69] hover:bg-[#f3a847] rounded font-bold text-[#0f1111]">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
