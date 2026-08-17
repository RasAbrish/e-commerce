'use client';

import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { useAuth } from '../../providers/auth-provider';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-[#131921] min-h-screen flex items-center justify-center text-white text-sm">
        Loading Admin Panel...
      </div>
    );
  }

  // Access control check
  if (!isAdmin) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-[#0f1111]">Access Denied</h2>
          <p className="text-sm text-gray-500">
            You must be logged in as an Administrator to view this page.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded transition-colors"
          >
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f3f3f3] min-h-[calc(100vh-98px)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Bright Ideas Administration
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Logged in as:</span>
            <span className="text-xs font-bold text-[#0f1111] bg-gray-100 px-2.5 py-1 rounded">
              {user?.firstName} ({user?.role})
            </span>
          </div>
        </header>
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
