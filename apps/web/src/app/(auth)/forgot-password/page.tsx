'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetchApi('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 shadow-md max-w-md w-full border border-gray-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#febd69]/20 text-[#c7511f] rounded-full flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Password Assistance</h1>
          <p className="text-xs text-[#565959]">
            Enter the email address associated with your Bright Ideas account.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
            <p className="text-xs text-green-900 font-medium leading-relaxed">
              If an account with <span className="font-bold">{email}</span> exists, we have sent instructions to reset your password. Please check your inbox.
            </p>
            <Link
              href="/login"
              className="inline-block pt-2 text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-[#0f1111] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#febd69]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Continue'}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
