'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { CheckCircle, Save, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [storeName, setStoreName] = useState('Bright Ideas Digital Store');
  const [currency, setCurrency] = useState('ETB');
  const [paymentProvider, setPaymentProvider] = useState('Chapa');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const res = await fetchApi('/api/admin/settings');
      if (res.success && res.data) {
        setSettings(res.data);
        setStoreName(res.data.storeName || 'Bright Ideas Digital Store');
        setCurrency(res.data.currency || 'ETB');
        setPaymentProvider(res.data.paymentProvider || 'Chapa');
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi('/api/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ storeName, currency, paymentProvider }),
    });
    if (res.success) {
      setSettings(res.data);
      setMessage(res.data?.message || 'Settings saved.');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const statusItems = [
    { label: 'Database', value: settings?.databaseConfigured ? 'Configured' : 'Missing', ok: settings?.databaseConfigured },
    { label: 'Chapa Secret', value: settings?.chapaConfigured ? 'Configured' : 'Missing', ok: settings?.chapaConfigured },
    { label: 'File Delivery', value: settings?.fileDelivery || 'LOCAL', ok: true },
    { label: 'Environment', value: settings?.apiEnvironment || 'production', ok: true },
    { label: 'CORS Origin', value: settings?.corsOrigin || '*', ok: true },
    { label: 'App URL', value: settings?.appUrl || 'Not set', ok: Boolean(settings?.appUrl) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1111]">Settings</h1>
        <p className="text-sm text-gray-500">Review store settings and deployment configuration.</p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={saveSettings} className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Settings className="w-5 h-5 text-[#e47911]" />
            <h2 className="text-lg font-bold text-[#0f1111]">Store Preferences</h2>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f1111] mb-1">Store Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#febd69]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                <option value="ETB">ETB</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0f1111] mb-1">Payment Provider</label>
              <select value={paymentProvider} onChange={(e) => setPaymentProvider(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                <option value="Chapa">Chapa</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </form>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0f1111] mb-4">System Status</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading settings...</p>
            ) : (
              statusItems.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">{item.label}</p>
                    <p className="text-sm text-[#0f1111] break-all">{item.value}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {item.ok ? 'OK' : 'Check'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
