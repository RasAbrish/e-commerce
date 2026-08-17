'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#131921] text-white min-h-full p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Brand */}
        <div className="px-3 py-2 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">
              Bright<span className="text-[#febd69]">Ideas</span>
            </span>
            <span className="bg-[#febd69] text-[#0f1111] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#febd69] text-[#0f1111] font-bold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#0f1111]' : 'text-gray-400')} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to store link */}
      <div className="pt-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
