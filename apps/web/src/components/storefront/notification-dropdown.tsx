'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, Download, Package, X, Check } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'download' | 'promo';
  link?: string;
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Order Confirmed',
      message: 'Payment for Ethiopian Tax & Payroll Calculator was successful via Chapa.',
      time: '10m ago',
      read: false,
      type: 'order',
      link: '/dashboard',
    },
    {
      id: 'n2',
      title: 'Digital File Ready',
      message: 'Your instant download link for Startup Handbook eBook is active.',
      time: '1h ago',
      read: false,
      type: 'download',
      link: '/dashboard',
    },
    {
      id: 'n3',
      title: 'New Promo Coupon',
      message: 'Use code BRIGHT2026 for 15% off all Excel calculators.',
      time: '1d ago',
      read: true,
      type: 'promo',
      link: '/products',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="relative">
      
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all hover:scale-105"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-100">
          
          {/* Popover Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 flex gap-3 items-start transition-colors cursor-pointer ${
                    !item.read ? 'bg-brand-500/5' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800 text-brand-400 mt-0.5">
                    {item.type === 'order' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.type === 'download' && <Download className="w-4 h-4 text-blue-400" />}
                    {item.type === 'promo' && <Package className="w-4 h-4 text-amber-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${!item.read ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[10px] font-bold text-brand-400 hover:underline mt-1.5"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
