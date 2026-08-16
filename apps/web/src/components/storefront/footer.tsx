'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-sm font-medium py-3.5 text-center transition-colors"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-[#232f3e]">
        <div className="max-w-[1500px] mx-auto px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div>
              <h4 className="text-base font-bold text-white mb-3">Get to Know Us</h4>
              <ul className="space-y-2 text-[13px] text-[#ddd]">
                <li><Link href="/" className="hover:underline">About Bright Ideas</Link></li>
                <li><Link href="/" className="hover:underline">Careers</Link></li>
                <li><Link href="/" className="hover:underline">Press Releases</Link></li>
                <li><Link href="/" className="hover:underline">Bright Ideas & Ethiopia</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold text-white mb-3">Make Money with Us</h4>
              <ul className="space-y-2 text-[13px] text-[#ddd]">
                <li><Link href="/" className="hover:underline">Sell products on Bright Ideas</Link></li>
                <li><Link href="/" className="hover:underline">Become an Affiliate</Link></li>
                <li><Link href="/" className="hover:underline">Publish Your eBook</Link></li>
                <li><Link href="/" className="hover:underline">Advertise Your Templates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold text-white mb-3">Chapa Payment</h4>
              <ul className="space-y-2 text-[13px] text-[#ddd]">
                <li><Link href="/checkout" className="hover:underline">Chapa Payment Gateway</Link></li>
                <li><Link href="/" className="hover:underline">Telebirr Integration</Link></li>
                <li><Link href="/" className="hover:underline">CBE Birr Payments</Link></li>
                <li><Link href="/" className="hover:underline">International Cards</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold text-white mb-3">Let Us Help You</h4>
              <ul className="space-y-2 text-[13px] text-[#ddd]">
                <li><Link href="/profile" className="hover:underline">Your Account</Link></li>
                <li><Link href="/dashboard" className="hover:underline">Your Orders</Link></li>
                <li><Link href="/dashboard" className="hover:underline">Download Center</Link></li>
                <li><Link href="/" className="hover:underline">Returns & Refunds</Link></li>
                <li><Link href="/" className="hover:underline">Help & FAQ</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#131a22]">
        <div className="max-w-[1500px] mx-auto px-8 py-5 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-white">Bright</span>
            <span className="text-lg font-extrabold text-[#febd69]">Ideas</span>
          </Link>
          <div className="flex items-center gap-4 text-[11px] text-[#999]">
            <Link href="/" className="hover:underline">Conditions of Use</Link>
            <Link href="/" className="hover:underline">Privacy Notice</Link>
            <Link href="/" className="hover:underline">Interest-Based Ads</Link>
          </div>
          <p className="text-[11px] text-[#999]">© 2026, BrightIdeas.et, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
};
