'use client';

import { Mail } from 'lucide-react';
import { useState, FormEvent } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In production, this would call an API to store the email
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#232f3e] to-[#37475a] py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-10 h-10 text-[#febd69] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Stay Updated with Bright Ideas
        </h2>
        <p className="text-gray-300 mb-6">
          Get notified about new digital products, exclusive discounts, and business tips for Ethiopian entrepreneurs.
        </p>

        {submitted ? (
          <div className="bg-green-600/20 border border-green-500 rounded-md p-4 text-green-300">
            ✓ Thank you for subscribing! We&apos;ll keep you updated.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-md text-[#0f1111] bg-white focus:outline-none focus:ring-2 focus:ring-[#febd69]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold rounded-md transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
