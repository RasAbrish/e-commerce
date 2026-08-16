'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Download, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider';
import { cn } from '../../lib/utils';

export function CustomerSidebarNav() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/dashboard/downloads', label: 'My Downloads', icon: Download },
    { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg p-5 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-[#febd69] text-[#0f1111] font-bold flex items-center justify-center text-lg">
          {user?.firstName?.[0] || 'U'}
        </div>
        <div>
          <h3 className="font-bold text-[#0f1111] text-base leading-tight">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-xs text-[#565959]">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#febd69]/20 text-[#c7511f] font-semibold'
                  : 'text-[#0f1111] hover:bg-gray-100 hover:text-[#c7511f]'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-[#c7511f]' : 'text-[#565959]')} />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors mt-4"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
