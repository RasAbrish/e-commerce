'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '../../../lib/api';
import { Check, XCircle, Loader2 } from 'lucide-react';

function PaymentSimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txRef = searchParams.get('tx_ref') || '';
  const amount = searchParams.get('amount') || '499.00';

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const handleSimulatePayment = async (success: boolean) => {
    setLoading(true);
    if (success) {
      const res = await fetchApi(`/api/payments/verify/${txRef}`);
      setLoading(false);
      if (res.success) {
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setStatus('failed');
      }
    } else {
      setLoading(false);
      setStatus('failed');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] border border-[#d5d9d9] rounded-lg shadow-sm p-8 text-center space-y-5">

        {/* Chapa Logo */}
        <div className="w-16 h-16 rounded-lg bg-[#232f3e] text-[#febd69] flex items-center justify-center mx-auto text-lg font-extrabold">
          CHAPA
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#0f1111]">Chapa Payment Simulator</h2>
          <p className="text-sm text-[#565959] mt-1">Test Mode — Ethiopia Digital Store</p>
        </div>

        {/* Transaction Info */}
        <div className="p-4 rounded-lg bg-[#f0f2f2] border border-[#d5d9d9] space-y-2 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-[#565959]">Transaction Ref:</span>
            <span className="text-[#0f1111] font-mono text-xs truncate max-w-[180px]">{txRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565959]">Amount:</span>
            <span className="text-[#0f1111] font-bold">ETB {amount}</span>
          </div>
        </div>

        {status === 'idle' && (
          <div className="space-y-3">
            <button
              onClick={() => handleSimulatePayment(true)}
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Simulate Successful Payment
            </button>

            <button
              onClick={() => handleSimulatePayment(false)}
              disabled={loading}
              className="w-full py-3 rounded-full bg-white hover:bg-[#fef2f2] border border-[#d5d9d9] text-sm font-medium text-[#b91c1c] flex items-center justify-center gap-2 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Simulate Payment Failure
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="p-5 rounded-lg bg-[#f0fff4] border border-[#067d62] text-center space-y-2">
            <Check className="w-10 h-10 text-[#067d62] mx-auto" />
            <p className="text-base font-bold text-[#067d62]">Payment Completed!</p>
            <p className="text-sm text-[#565959]">Redirecting to your downloads...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="p-5 rounded-lg bg-[#fef2f2] border border-[#fca5a5] text-center space-y-2">
            <XCircle className="w-10 h-10 text-[#b91c1c] mx-auto" />
            <p className="text-base font-bold text-[#b91c1c]">Transaction Failed</p>
            <button
              onClick={() => router.push('/checkout')}
              className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline mt-1"
            >
              Return to Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PaymentSimulationPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen flex items-center justify-center text-sm text-[#565959]">Loading simulator...</div>}>
      <PaymentSimulationContent />
    </Suspense>
  );
}
