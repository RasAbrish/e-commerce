'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, MapPin, ChevronDown, Menu, X, User, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '../../stores/cart-store';
import { useAuthStore } from '../../stores/auth-store';

export const Header: React.FC = () => {
  const router = useRouter();
  const { items, toggleCart } = useCartStore();
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main Nav Bar — Amazon Dark */}
      <div className="bg-[#131921]">
        <div className="max-w-[1500px] mx-auto px-4 flex items-center h-[60px] gap-3">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded border border-transparent hover:border-white/30 transition-colors">
            <span className="text-xl font-extrabold text-white tracking-tight leading-none">Bright</span>
            <span className="text-xl font-extrabold text-[#febd69] tracking-tight leading-none">Ideas</span>
          </Link>

          {/* Deliver To */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/30 cursor-pointer transition-colors flex-shrink-0">
            <MapPin className="w-4 h-4 text-white/60" />
            <div className="leading-tight">
              <span className="text-[10px] text-white/60 block">Deliver to</span>
              <span className="text-sm font-bold text-white">Ethiopia</span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex h-[42px] rounded-md overflow-hidden">
            <select className="hidden sm:block bg-[#e6e6e6] text-[#555] text-xs font-semibold px-3 border-r border-[#cdcdcd] outline-none cursor-pointer">
              <option>All Categories</option>
              <option>Excel Templates</option>
              <option>eBooks</option>
              <option>Business Systems</option>
            </select>
            <input
              type="text"
              placeholder="Search digital tools, Excel calculators, eBooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white text-sm text-[#0f1111] px-4 outline-none placeholder-[#999]"
            />
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors"
            >
              <Search className="w-5 h-5 text-[#131921]" />
            </button>
          </form>

          {/* Right Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            
            {/* Account & Lists */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                onMouseEnter={() => setAccountDropdownOpen(true)}
                className="px-2 py-1.5 rounded border border-transparent hover:border-white/30 transition-colors text-left leading-tight"
              >
                <span className="text-[10px] text-white/70 block">
                  Hello, {mounted && isAuthenticated() ? (user?.firstName || 'User') : 'sign in'}
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-0.5">
                  Account & Lists <ChevronDown className="w-3 h-3 text-white/50" />
                </span>
              </button>

              {/* Account Dropdown */}
              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-0 w-[340px] bg-white rounded-b-lg shadow-2xl border border-[#ddd] z-50 overflow-hidden"
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  {mounted && isAuthenticated() ? (
                    <div className="p-5">
                      <div className="text-center pb-4 border-b border-[#eee]">
                        <div className="w-12 h-12 rounded-full bg-[#232f3e] text-white flex items-center justify-center text-lg font-bold mx-auto mb-2">
                          {user?.firstName?.[0] || 'A'}
                        </div>
                        <p className="text-sm font-bold text-[#0f1111]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[#565959]">{user?.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div>
                          <h4 className="text-xs font-bold text-[#0f1111] mb-2 uppercase">Your Account</h4>
                          <ul className="space-y-1.5 text-xs text-[#007185]">
                            <li><Link href="/profile" className="hover:text-[#c7511f] hover:underline">Your Account</Link></li>
                            <li><Link href="/dashboard" className="hover:text-[#c7511f] hover:underline">Your Orders</Link></li>
                            <li><Link href="/dashboard" className="hover:text-[#c7511f] hover:underline">Your Downloads</Link></li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#0f1111] mb-2 uppercase">Quick Links</h4>
                          <ul className="space-y-1.5 text-xs text-[#007185]">
                            <li><Link href="/products" className="hover:text-[#c7511f] hover:underline">Browse All</Link></li>
                            {isAdmin() && (
                              <li><Link href="/admin" className="hover:text-[#c7511f] hover:underline">Admin Panel</Link></li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <button
                        onClick={() => { logout(); setAccountDropdownOpen(false); }}
                        className="mt-4 w-full py-2 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-bold text-[#0f1111] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="text-center">
                        <Link
                          href="/login"
                          className="block w-full py-2 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-bold text-[#0f1111] transition-colors"
                        >
                          Sign In
                        </Link>
                        <p className="text-[11px] text-[#565959] mt-2">
                          New customer? <Link href="/register" className="text-[#007185] hover:text-[#c7511f] hover:underline">Start here.</Link>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link
              href="/dashboard"
              className="px-2 py-1.5 rounded border border-transparent hover:border-white/30 transition-colors leading-tight"
            >
              <span className="text-[10px] text-white/70 block">Returns</span>
              <span className="text-sm font-bold text-white">& Orders</span>
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex items-end gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white/30 transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-8 h-8 text-white" />
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#f08804] font-extrabold text-base leading-none">
                  {totalItems}
                </span>
              </div>
              <span className="text-sm font-bold text-white pb-0.5">Cart</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub Nav Bar — Categories */}
      <div className="bg-[#232f3e]">
        <div className="max-w-[1500px] mx-auto px-4 flex items-center h-[39px] gap-1 overflow-x-auto text-sm text-white">
          <Link href="/products" className="px-3 py-1.5 rounded hover:bg-white/10 font-bold text-sm whitespace-nowrap flex items-center gap-1 transition-colors">
            <Menu className="w-4 h-4" /> All
          </Link>
          <Link href="/products?category=excel-templates" className="px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap transition-colors">
            Excel Calculators
          </Link>
          <Link href="/products?category=ebooks" className="px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap transition-colors">
            eBooks & Guides
          </Link>
          <Link href="/products?category=business-systems" className="px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap transition-colors">
            Business Systems
          </Link>
          <Link href="/products" className="px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap text-[#f08804] font-bold transition-colors">
            Today&apos;s Deals
          </Link>
          <Link href="/dashboard" className="px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap transition-colors">
            My Downloads
          </Link>
          <Link href="/profile" className="px-3 py-1.5 rounded hover:bg-white/10 whitespace-nowrap transition-colors">
            Customer Service
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#232f3e] border-t border-white/10 py-3 px-4 space-y-2">
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white py-2">All Products</Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white py-2">My Orders & Downloads</Link>
          <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white py-2">Your Account</Link>
          <Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white py-2">Cart ({totalItems})</Link>
          {mounted && isAuthenticated() ? (
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block text-sm text-[#f08804] py-2">Sign Out</button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-[#f08804] py-2">Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
};
