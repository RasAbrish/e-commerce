'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { Plus, Tag, Check, X } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('15');
  const [minOrder, setMinOrder] = useState('0');

  const loadCoupons = async () => {
    setLoading(true);
    const res = await fetchApi<any[]>('/api/coupons');
    if (res.success && res.data) {
      setCoupons(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code,
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: parseFloat(minOrder) || 0,
    };
    const res = await fetchApi('/api/coupons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.success) {
      setShowModal(false);
      setCode('');
      loadCoupons();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Discount Coupons</h1>
          <p className="text-sm text-gray-500">Create and manage promotional codes for customer checkouts.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Code</th>
              <th className="px-6 py-3.5">Discount Type</th>
              <th className="px-6 py-3.5">Discount Value</th>
              <th className="px-6 py-3.5">Min Order</th>
              <th className="px-6 py-3.5">Uses</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No coupons created yet.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#c7511f]">
                    {c.code}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                    {c.discountType}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#0f1111]">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : formatCurrency(Number(c.discountValue))}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {formatCurrency(Number(c.minOrderAmount || 0))}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#0f1111]">
                    {c.usedCount || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                      {c.status || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-[#0f1111]">Create New Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ETHIOPIA2026"
                  required
                  className="w-full px-3 py-2 border rounded font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (ETB)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Discount Value</label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0f1111] mb-1">Minimum Order Amount (ETB)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#febd69] hover:bg-[#f3a847] rounded font-bold text-[#0f1111]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
