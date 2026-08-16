'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Lock, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetchApi('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(res.error || 'Failed to reset password. Token may be invalid or expired.');
    }
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 shadow-md max-w-md w-full border border-gray-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#febd69]/20 text-[#c7511f] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Create New Password</h1>
          <p className="text-xs text-[#565959]">
            Choose a strong password with at least 8 characters.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
            <p className="text-xs text-green-900 font-medium">
              Your password has been successfully reset! Redirecting to sign in page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0f1111] mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f1111] mb-1">
                Re-enter New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#febd69]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Save Password & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
