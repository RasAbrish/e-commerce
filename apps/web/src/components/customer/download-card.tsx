'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { formatFileSize, formatDate } from '../../lib/format';
import { fetchApi } from '../../lib/api';

interface DownloadCardProps {
  file: {
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    productName: string;
    productSlug: string;
    productImage?: string | null;
    orderId: string;
    orderNumber: string;
    purchasedAt: string;
  };
}

export function DownloadCard({ file }: DownloadCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Generate one-time download token
      const res = await fetchApi<{ downloadUrl: string }>(
        `/api/downloads/token/${file.orderId}/${file.fileId}`,
        { method: 'POST' }
      );

      if (res.success && res.data?.downloadUrl) {
        // Trigger browser download via dynamic link
        const link = document.createElement('a');
        link.href = res.data.downloadUrl;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const getFileIcon = () => {
    if (file.fileName.endsWith('.xlsx') || file.fileName.endsWith('.xls') || file.mimeType.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    }
    if (file.fileName.endsWith('.pdf') || file.mimeType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-600" />;
    }
    return <BookOpen className="w-8 h-8 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-50 rounded-lg shrink-0">
          {getFileIcon()}
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#0f1111] text-base leading-snug">
            {file.productName}
          </h4>
          <p className="text-xs text-gray-500 font-mono">
            {file.fileName} ({formatFileSize(file.fileSize)})
          </p>
          <div className="flex items-center gap-3 text-xs text-[#565959] pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Purchased {formatDate(file.purchasedAt)}
            </span>
            <span className="flex items-center gap-1 text-green-700 font-medium">
              <ShieldCheck className="w-3 h-3" />
              Verified License
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full sm:w-auto px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{downloading ? 'Preparing...' : 'Download File'}</span>
      </button>
    </div>
  );
}
