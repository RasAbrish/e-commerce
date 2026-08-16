'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/auth-store';
import { fetchApi } from '../../../lib/api';
import { ShieldCheck, Zap, Download, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password, phone }),
    });

    setLoading(false);

    if (res.success && res.data) {
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } else {
      setAuth(
        { id: 'user-new', email, firstName, lastName, role: 'CUSTOMER' },
        'mock-access-token', 'mock-refresh-token'
      );
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-[#e3e6e6] min-h-[calc(100vh-100px)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Side Image & Feature Showcase */}
        <div className="relative bg-[#232f3e] text-white p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Background overlay image */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200"
              alt="Ethiopian Business Tools"
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
              Join Thousands of <br />
              <span className="text-[#febd69]">Ethiopian Business Professionals</span>
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-md">
              Create a free account to instantly access tax calculators, financial spreadsheets, and entrepreneurship eBooks.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-[#febd69] flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#febd69]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Account Activation</h4>
                  <p className="text-[11px] text-white/60">Start shopping and downloading tools immediately</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-emerald-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Secure Chapa Payments</h4>
                  <p className="text-[11px] text-white/60">Pay seamlessly via Telebirr, CBE Birr, or Credit/Debit cards</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-blue-400 flex-shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Digital Library Hub</h4>
                  <p className="text-[11px] text-white/60">Store all your receipts, order history, and downloads in one place</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#febd69]" />
              <span className="text-xs text-white/80 font-medium">100% Ethiopian Business Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Side: Amazon-style Create Account Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-[360px] mx-auto w-full">
            
            <h1 className="text-2xl font-bold text-[#0f1111] mb-2">Create account</h1>
            <p className="text-xs text-[#565959] mb-5">Set up your free account to get started.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">Your name</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full border border-[#888c8c] rounded-lg px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                  />
                  <input
                    type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full border border-[#888c8c] rounded-lg px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">Mobile number or email</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="abebe@example.com"
                  className="w-full border border-[#888c8c] rounded-lg px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">Phone number (optional)</label>
                <input
                  type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251911223344"
                  className="w-full border border-[#888c8c] rounded-lg px-3 py-2 text-sm text-[#0f1111] font-mono focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">Password</label>
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full border border-[#888c8c] rounded-lg px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
                <p className="text-[11px] text-[#565959] mt-0.5">
                  ⓘ Passwords must be at least 6 characters.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">Re-enter password</label>
                <input
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#888c8c] rounded-lg px-3 py-2 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>

              {error && <p className="text-xs text-[#b91c1c] font-medium">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Creating...' : 'Create account'}</span>
                <ArrowRight className="w-4 h-4 text-[#0f1111]" />
              </button>
            </form>

            <p className="text-xs text-[#565959] mt-4 leading-relaxed">
              By creating an account, you agree to Bright Ideas&apos; <Link href="#" className="text-[#007185] hover:text-[#c7511f] hover:underline">Conditions of Use</Link> and <Link href="#" className="text-[#007185] hover:text-[#c7511f] hover:underline">Privacy Notice</Link>.
            </p>

            <hr className="my-4 border-[#e3e6e6]" />

            <p className="text-xs text-[#0f1111] font-medium text-center">
              Already have an account? <Link href="/login" className="text-[#007185] hover:text-[#c7511f] hover:underline font-bold">Sign in →</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
