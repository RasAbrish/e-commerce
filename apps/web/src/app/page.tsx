'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroBanner } from '../components/storefront/hero-banner';
import { ProductCard } from '../components/storefront/product-card';
import { fetchApi } from '../lib/api';
import { ChevronRight, Zap, Shield, Download, Clock, Award, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackProducts = [
    {
      id: 'p1', name: 'Ethiopian Tax & Payroll Excel Calculator (2026 Edition)',
      slug: 'ethiopian-tax-and-payroll-excel-calculator', price: 499.0, compareAtPrice: 850.0,
      type: 'EXCEL_TEMPLATE', averageRating: 4.9, totalReviews: 14,
      images: [{ url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800' }],
    },
    {
      id: 'p2', name: 'The Ethiopian Startup Handbook: 0 to 1 Million ETB',
      slug: 'ethiopian-startup-handbook-ebook', price: 350.0, compareAtPrice: 500.0,
      type: 'EBOOK', averageRating: 4.8, totalReviews: 8,
      images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800' }],
    },
    {
      id: 'p3', name: 'Complete Store Inventory & Sales Tracker (Excel System)',
      slug: 'complete-inventory-and-pos-excel-system', price: 750.0, compareAtPrice: 1200.0,
      type: 'BUSINESS_SYSTEM', averageRating: 5.0, totalReviews: 15,
      images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }],
    },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const prodRes = await fetchApi('/api/products/featured');
      if (prodRes.success && prodRes.data?.length > 0) {
        setProducts(prodRes.data);
      } else {
        setProducts(fallbackProducts);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const categoryCards = [
    { title: 'Excel Tax Calculators', subtitle: 'ERCA-compliant formulas & payroll tools', href: '/products?category=excel-templates', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
    { title: 'eBooks & Guides', subtitle: 'Business registration, licensing & strategy', href: '/products?category=ebooks', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400' },
    { title: 'Business Systems', subtitle: 'Inventory, POS & operations management', href: '/products?category=business-systems', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' },
    { title: "Today's Deals", subtitle: 'Limited-time discounts on top products', href: '/products', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=400' },
  ];

  const dealProducts = [
    { id: 'd1', name: 'Ethiopian VAT Calculator & Invoice Generator', slug: 'ethiopian-tax-and-payroll-excel-calculator', price: 299.0, compareAtPrice: 600.0, type: 'EXCEL_TEMPLATE', averageRating: 4.7, totalReviews: 9, images: [{ url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800' }] },
    { id: 'd2', name: 'Ethiopian Business License Guide (PDF)', slug: 'ethiopian-startup-handbook-ebook', price: 199.0, compareAtPrice: 400.0, type: 'EBOOK', averageRating: 4.6, totalReviews: 6, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800' }] },
    { id: 'd3', name: 'HR & Employee Management System (Excel)', slug: 'complete-inventory-and-pos-excel-system', price: 449.0, compareAtPrice: 900.0, type: 'BUSINESS_SYSTEM', averageRating: 4.9, totalReviews: 11, images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }] },
  ];

  return (
    <div className="bg-[#e3e6e6] min-h-screen">

      {/* Hero Carousel */}
      <HeroBanner />

      {/* Category Grid — overlapping the hero fade */}
      <div className="max-w-[1500px] mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryCards.map((cat) => (
            <div key={cat.title} className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-[#0f1111] mb-3">{cat.title}</h3>
              <Link href={cat.href} className="block">
                <img src={cat.image} alt={cat.title} className="w-full h-44 object-cover rounded-md hover:opacity-90 transition-opacity" />
              </Link>
              <p className="text-xs text-[#565959] mt-2">{cat.subtitle}</p>
              <Link href={cat.href} className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium mt-2 inline-block">
                See more
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Why Bright Ideas — Feature Strip */}
      <div className="max-w-[1500px] mx-auto px-4 mt-8">
        <div className="bg-[#232f3e] rounded-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Zap className="w-7 h-7" />, title: 'Instant Delivery', desc: 'Download immediately after Chapa payment', color: 'text-[#febd69]' },
            { icon: <Shield className="w-7 h-7" />, title: 'Verified Products', desc: 'Every template tested for ERCA compliance', color: 'text-[#48bb78]' },
            { icon: <Clock className="w-7 h-7" />, title: '72-Hour Access', desc: 'Extended download window with 5 attempts', color: 'text-[#63b3ed]' },
            { icon: <Award className="w-7 h-7" />, title: 'Money-Back Guarantee', desc: 'Full refund if the product doesn\'t work', color: 'text-[#f6ad55]' },
          ].map((feat) => (
            <div key={feat.title} className="flex items-start gap-3">
              <div className={`flex-shrink-0 ${feat.color}`}>{feat.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="max-w-[1500px] mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#0f1111]">Best Sellers in Digital Products</h2>
            <Link href="/products" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Deals of the Day */}
      <div className="max-w-[1500px] mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#0f1111]">Today&apos;s Deals</h2>
              <span className="text-xs font-bold text-white bg-[#cc0c39] px-2.5 py-1 rounded-sm">Up to 50% off</span>
            </div>
            <Link href="/products" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium flex items-center gap-1">
              See all deals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Popular in Ethiopia — Horizontal Scroll */}
      <div className="max-w-[1500px] mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#0f1111] mb-5">Popular in Ethiopia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Income Tax Calculator', category: 'Excel', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300', href: '/products?category=excel-templates' },
              { label: 'Business Registration Guide', category: 'eBook', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300', href: '/products?category=ebooks' },
              { label: 'Store Inventory Tracker', category: 'System', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300', href: '/products?category=business-systems' },
              { label: 'Chapa Payment Guides', category: 'eBook', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=300', href: '/products?category=ebooks' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="group">
                <div className="relative rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.label} className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-xs text-white/70">{item.category}</span>
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-[1500px] mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#0f1111] mb-6 text-center">How Bright Ideas Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Browse & Choose', desc: 'Find verified Ethiopian digital tools — Excel templates, eBooks, business systems.', color: 'bg-[#232f3e]' },
              { step: '2', title: 'Pay with Chapa', desc: 'Secure checkout via Telebirr, CBE Birr, Awash Birr, or international cards.', color: 'bg-[#e47911]' },
              { step: '3', title: 'Download Instantly', desc: 'Get your files immediately. 72-hour access window with up to 5 downloads.', color: 'bg-[#007600]' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-14 h-14 ${s.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3`}>
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-[#0f1111]">{s.title}</h3>
                <p className="text-sm text-[#565959] mt-1 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div className="max-w-[1500px] mx-auto px-4 mt-8 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#0f1111]">Recommended for you</h2>
            <Link href="/products" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium flex items-center gap-1">
              See more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id + '-rec'} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Sign-up CTA Banner */}
      <div className="max-w-[1500px] mx-auto px-4 mb-10">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-base text-[#0f1111]">
            See personalized recommendations
          </p>
          <Link
            href="/login"
            className="mt-3 inline-block px-10 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors"
          >
            Sign in
          </Link>
          <p className="text-xs text-[#565959] mt-2">
            New customer? <Link href="/register" className="text-[#007185] hover:text-[#c7511f] hover:underline">Start here.</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
