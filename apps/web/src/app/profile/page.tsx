'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../stores/auth-store';
import { ChevronRight, Package, User, CreditCard, Bell, Shield, Settings, ArrowRight, Save, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [activeSection, setActiveSection] = useState<'grid' | 'security' | 'notifications'>('grid');

  const [firstName, setFirstName] = useState(user?.firstName || 'Abebe');
  const [lastName, setLastName] = useState(user?.lastName || 'Bikila');
  const [email] = useState(user?.email || 'customer@brightideas.et');
  const [phone, setPhone] = useState(user?.phone || '+251912345678');
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [newReleases, setNewReleases] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setAuth({ ...user, firstName, lastName, phone }, localStorage.getItem('accessToken') || '', localStorage.getItem('refreshToken') || '');
    }
    setSavedMsg('Your changes have been saved.');
    setTimeout(() => setSavedMsg(null), 4000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#007185] mb-5">
          <Link href="/" className="hover:text-[#c7511f] hover:underline">Bright Ideas</Link>
          <ChevronRight className="w-3 h-3 text-[#999]" />
          <span className="text-[#565959]">Your Account</span>
        </nav>

        <h1 className="text-[28px] font-normal text-[#0f1111] mb-6">Your Account</h1>

        {savedMsg && (
          <div className="mb-5 p-4 bg-[#f0fff4] border border-[#067d62] rounded-lg flex items-center gap-2 text-sm text-[#067d62]">
            <Check className="w-5 h-5" /> {savedMsg}
          </div>
        )}

        {activeSection !== 'grid' && (
          <button
            onClick={() => setActiveSection('grid')}
            className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline mb-5 inline-block"
          >
            ← Back to Your Account
          </button>
        )}

        {/* Amazon-Style Account Grid */}
        {activeSection === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Your Orders */}
            <Link href="/dashboard" className="flex gap-4 p-5 border border-[#d5d9d9] rounded-lg hover:bg-[#f7f8f8] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e3e6e6] transition-colors">
                <Package className="w-6 h-6 text-[#232f3e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f1111]">Your Orders</h3>
                <p className="text-sm text-[#565959] mt-0.5">Track, return, or buy things again</p>
              </div>
            </Link>

            {/* Login & Security */}
            <button onClick={() => setActiveSection('security')} className="flex gap-4 p-5 border border-[#d5d9d9] rounded-lg hover:bg-[#f7f8f8] transition-colors group text-left">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e3e6e6] transition-colors">
                <Shield className="w-6 h-6 text-[#232f3e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f1111]">Login & Security</h3>
                <p className="text-sm text-[#565959] mt-0.5">Edit login, name, and phone number</p>
              </div>
            </button>

            {/* Your Downloads */}
            <Link href="/dashboard" className="flex gap-4 p-5 border border-[#d5d9d9] rounded-lg hover:bg-[#f7f8f8] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e3e6e6] transition-colors">
                <ArrowRight className="w-6 h-6 text-[#232f3e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f1111]">Your Downloads</h3>
                <p className="text-sm text-[#565959] mt-0.5">Access purchased digital files</p>
              </div>
            </Link>

            {/* Chapa Payment Methods */}
            <div className="flex gap-4 p-5 border border-[#d5d9d9] rounded-lg hover:bg-[#f7f8f8] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e3e6e6] transition-colors">
                <CreditCard className="w-6 h-6 text-[#232f3e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f1111]">Payment Methods</h3>
                <p className="text-sm text-[#565959] mt-0.5">Chapa gateway — Telebirr, CBE Birr, Cards</p>
              </div>
            </div>

            {/* Notification Preferences */}
            <button onClick={() => setActiveSection('notifications')} className="flex gap-4 p-5 border border-[#d5d9d9] rounded-lg hover:bg-[#f7f8f8] transition-colors group text-left">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e3e6e6] transition-colors">
                <Bell className="w-6 h-6 text-[#232f3e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f1111]">Communication Preferences</h3>
                <p className="text-sm text-[#565959] mt-0.5">Choose what emails you receive</p>
              </div>
            </button>

            {/* Contact Us */}
            <div className="flex gap-4 p-5 border border-[#d5d9d9] rounded-lg hover:bg-[#f7f8f8] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#f0f2f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e3e6e6] transition-colors">
                <Settings className="w-6 h-6 text-[#232f3e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f1111]">Contact Us</h3>
                <p className="text-sm text-[#565959] mt-0.5">Help center and customer service</p>
              </div>
            </div>
          </div>
        )}

        {/* Login & Security Form */}
        {activeSection === 'security' && (
          <div className="max-w-[600px]">
            <h2 className="text-xl font-bold text-[#0f1111] mb-5">Login & Security</h2>
            <form onSubmit={handleSave} className="space-y-0">
              {/* Name Row */}
              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">Name</span>
                  <span className="text-sm text-[#0f1111]">{firstName} {lastName}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-[#888c8c] rounded-md px-3 py-1.5 text-sm w-28 focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                    placeholder="First"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-[#888c8c] rounded-md px-3 py-1.5 text-sm w-28 focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                    placeholder="Last"
                  />
                </div>
              </div>

              {/* Email Row */}
              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">Email</span>
                  <span className="text-sm text-[#0f1111]">{email}</span>
                </div>
                <span className="text-sm text-[#565959]">Verified ✓</span>
              </div>

              {/* Phone Row */}
              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">Mobile number</span>
                  <span className="text-sm text-[#0f1111]">{phone}</span>
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-[#888c8c] rounded-md px-3 py-1.5 text-sm w-44 font-mono focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              {/* Password Row */}
              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">Password</span>
                  <span className="text-sm text-[#0f1111]">********</span>
                </div>
                <button type="button" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">Edit</button>
              </div>

              <div className="pt-5">
                <button type="submit" className="px-8 py-2 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notification Preferences */}
        {activeSection === 'notifications' && (
          <div className="max-w-[600px]">
            <h2 className="text-xl font-bold text-[#0f1111] mb-5">Communication Preferences</h2>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">Purchase Receipts</span>
                  <span className="text-sm text-[#565959]">Receive email receipts after Chapa checkout</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailReceipts} onChange={(e) => setEmailReceipts(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e47911]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">New Product Launches</span>
                  <span className="text-sm text-[#565959]">Alerts when new ERCA tools are published</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={newReleases} onChange={(e) => setNewReleases(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e47911]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#e3e6e6]">
                <div>
                  <span className="text-sm font-bold text-[#0f1111] block">Download Expiration Reminders</span>
                  <span className="text-sm text-[#565959]">Reminders before your 72h download token expires</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={expirationAlerts} onChange={(e) => setExpirationAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e47911]"></div>
                </label>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
