'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/auth-store';
import { fetchApi } from '../../../lib/api';
import { ShieldCheck, Zap, Download, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.success && res.data) {
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      const role = res.data.user?.role;
      router.push(role === 'ADMIN' || role === 'SUPER_ADMIN' ? '/admin' : '/dashboard');
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  return (
    <div className="bg-[#e3e6e6] min-h-[calc(100vh-100px)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Side Image & Feature Showcase */}
        <div className="relative bg-[#131921] text-white p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Background overlay image with dark tint */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200"
              alt="Digital tools showcase"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            {/* Brand Logo */}
            <Link href="/" className="inline-flex items-center gap-1.5 mb-8">
              <span className="text-2xl font-extrabold text-white tracking-tight">Bright</span>
              <span className="text-2xl font-extrabold text-[#febd69] tracking-tight">Ideas</span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white mb-4">
              Access Your Digital <br />
              <span className="text-[#febd69]">Assets & Tools</span>
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-md">
              Sign in to download verified Ethiopian ERCA tax calculators, payroll Excel models, and business eBooks anytime.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-[#febd69] flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant File Downloads</h4>
                  <p className="text-[11px] text-white/60">Immediate download token generated after Chapa checkout</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-[#007185] flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ERCA 2026 Tax Compliant</h4>
                  <p className="text-[11px] text-white/60">Fully editable Excel models built strictly for Ethiopian revenue rules</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-[#febd69] flex-shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-[#febd69]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Lifetime Access & Re-downloads</h4>
                  <p className="text-[11px] text-white/60">Access all your purchased tools directly from your Customer Orders library</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card / Badge */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/80 font-medium">Chapa Payment Gateway Integrated</span>
            </div>
            <span className="text-xs font-mono text-[#febd69] font-bold">Telebirr • CBE Birr</span>
          </div>
        </div>

        {/* Right Side: Amazon-style Sign In Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-[360px] mx-auto w-full">
            
            <h1 className="text-2xl font-bold text-[#0f1111] mb-2">Sign in</h1>
            <p className="text-xs text-[#565959] mb-6">Enter your email and password to access your account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@brightideas.et"
                  className="w-full border border-[#888c8c] rounded-lg px-3.5 py-2.5 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#0f1111]">Password</label>
                  <Link href="#" className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full border border-[#888c8c] rounded-lg px-3.5 py-2.5 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              {error && <p className="text-xs text-[#b91c1c] font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4 text-[#0f1111]" />
              </button>
            </form>

            <p className="text-xs text-[#565959] mt-5 leading-relaxed">
              By continuing, you agree to Bright Ideas&apos; <Link href="#" className="text-[#007185] hover:text-[#c7511f] hover:underline">Conditions of Use</Link> and <Link href="#" className="text-[#007185] hover:text-[#c7511f] hover:underline">Privacy Notice</Link>.
            </p>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e3e6e6]" />
              <span className="text-xs text-[#767676]">New to Bright Ideas?</span>
              <div className="flex-1 h-px bg-[#e3e6e6]" />
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 rounded-full bg-[#f0f2f2] hover:bg-[#e3e6e6] text-xs font-bold text-[#0f1111] text-center border border-[#d5d9d9] shadow-sm transition-colors block"
            >
              Create your Bright Ideas account
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
