'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Search, UserCheck, Mail, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetchApi<any>(`/api/users/customers?${params.toString()}`);
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setLoading(false);
    }
    loadCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1111]">Registered Customers</h1>
        <p className="text-sm text-gray-500">View customer accounts, contact details, and purchase history.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name or email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm text-[#0f1111] focus:outline-none focus:ring-2 focus:ring-[#febd69]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Customer Name</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Phone</th>
              <th className="px-6 py-3.5">Orders</th>
              <th className="px-6 py-3.5">Joined Date</th>
              <th className="px-6 py-3.5">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0f1111]">
                    {cust.firstName} {cust.lastName}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {cust.email}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">
                    {cust.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-[#0f1111]">
                    {cust._count?.orders || 0}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {formatDate(cust.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {cust.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                        Disabled
                      </span>
                    )}
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
