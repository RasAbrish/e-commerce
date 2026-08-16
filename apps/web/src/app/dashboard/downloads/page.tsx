'use client';

import { useEffect, useState } from 'react';
import { CustomerSidebarNav } from '@/components/customer/sidebar-nav';
import { DownloadCard } from '@/components/customer/download-card';
import { fetchApi } from '@/lib/api';
import { Download, PackageOpen } from 'lucide-react';

export default function DownloadsPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      setLoading(true);
      const res = await fetchApi<any[]>('/api/downloads/my-files');
      if (res.success && res.data) {
        setFiles(res.data);
      }
      setLoading(false);
    }
    loadFiles();
  }, []);

  return (
    <div className="bg-[#e3e6e6] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <CustomerSidebarNav />

          <main className="flex-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0f1111] flex items-center gap-2">
                  <Download className="w-6 h-6 text-[#febd69]" />
                  My Digital Downloads
                </h1>
                <p className="text-sm text-[#565959] mt-1">
                  Access and redownload your purchased Ethiopian business tools, templates, and eBooks anytime.
                </p>
              </div>
              <span className="bg-gray-100 text-[#0f1111] font-bold text-sm px-3 py-1 rounded-full">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-sm">
                Loading your purchased files...
              </div>
            ) : files.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm space-y-4">
                <PackageOpen className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#0f1111]">No Digital Downloads Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  You haven&apos;t purchased any digital items yet or your order payment is pending.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <DownloadCard key={file.fileId || file.fileName} file={file} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
