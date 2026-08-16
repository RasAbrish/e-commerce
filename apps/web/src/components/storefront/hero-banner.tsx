'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    headline: 'Ethiopian Tax & Payroll Calculator',
    subtext: 'ERCA 2026-compliant Excel formulas. Automated income tax, pension, and payslip generation.',
    cta: 'Shop Now',
    ctaHref: '/products/ethiopian-tax-and-payroll-excel-calculator',
    bgGradient: 'from-[#232f3e] to-[#37475a]',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=900',
    badge: 'Best Seller',
    price: 'ETB 499',
    oldPrice: 'ETB 850',
  },
  {
    id: 2,
    headline: 'The Ethiopian Startup Handbook',
    subtext: 'From 0 to 1 Million ETB — business registration, Chapa setup, Telegram marketing strategies.',
    cta: 'Get the eBook',
    ctaHref: '/products/ethiopian-startup-handbook-ebook',
    bgGradient: 'from-[#1a365d] to-[#2a4365]',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=900',
    badge: 'New Release',
    price: 'ETB 350',
    oldPrice: 'ETB 500',
  },
  {
    id: 3,
    headline: 'Complete Inventory & Sales Tracker',
    subtext: 'Excel-based POS system with stock management, sales dashboard, and automated reporting.',
    cta: 'View System',
    ctaHref: '/products/complete-inventory-and-pos-excel-system',
    bgGradient: 'from-[#1c4532] to-[#276749]',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
    badge: 'Top Rated',
    price: 'ETB 750',
    oldPrice: 'ETB 1,200',
  },
  {
    id: 4,
    headline: 'Digital Tools Sale — Up to 50% Off',
    subtext: 'Limited time discounts on all Ethiopian business Excel templates and eBook bundles.',
    cta: 'See All Deals',
    ctaHref: '/products',
    bgGradient: 'from-[#742a2a] to-[#9b2c2c]',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=900',
    badge: 'Limited Time',
    price: 'Up to 50% off',
    oldPrice: '',
  },
];

export const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-scroll every 5s (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Area */}
      <div className={`relative bg-gradient-to-r ${slide.bgGradient} transition-colors duration-700`}>
        <div className="max-w-[1500px] mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">

            {/* Left: Text Content */}
            <div className="flex flex-col justify-center px-8 lg:px-16 py-10 z-10 relative">
              <span className="inline-block text-[11px] font-bold text-[#febd69] uppercase tracking-wider mb-2">
                {slide.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white leading-tight">
                {slide.headline}
              </h2>
              <p className="text-sm text-white/70 mt-3 max-w-md leading-relaxed">
                {slide.subtext}
              </p>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-bold text-white">{slide.price}</span>
                {slide.oldPrice && (
                  <span className="text-sm text-white/50 line-through">{slide.oldPrice}</span>
                )}
              </div>
              <Link
                href={slide.ctaHref}
                className="mt-5 inline-flex items-center justify-center w-fit px-8 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] shadow-sm transition-colors"
              >
                {slide.cta}
              </Link>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:flex items-center justify-center p-8 relative">
              <div className="relative w-full max-w-[420px]">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-[300px] object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Prev / Next Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/10 transition-colors z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/10 transition-colors z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#e3e6e6] to-transparent pointer-events-none z-10" />

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
