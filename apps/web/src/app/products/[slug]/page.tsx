'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { useCartStore } from '../../../stores/cart-store';
import { ProductCard } from '../../../components/storefront/product-card';
import { ShoppingCart, ChevronRight, Check, Lock, ArrowRight, Star, MessageSquarePlus, X } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState<string | null>(null);

  const fallbackProductMap: Record<string, any> = {
    'ethiopian-tax-and-payroll-excel-calculator': {
      id: 'p1',
      name: 'Ethiopian Tax & Payroll Excel Calculator (2026 Edition)',
      slug: 'ethiopian-tax-and-payroll-excel-calculator',
      brand: 'Bright Ideas Ethiopia',
      description: 'Fully automated Excel financial system built to Ethiopian ERCA tax regulations.',
      aboutItem: [
        'Automated Ethiopian ERCA Income Tax brackets calculation (0% to 35%)',
        'Built-in pension fund contributions: 7% employee + 11% employer',
        'Printable & PDF-ready employee payslip generator template included',
        'Fully editable source file (.xlsx) — no password protection',
        'Updated for current 2026 Ethiopian revenue authority guidelines',
        'Works with Microsoft Excel 2016+, Office 365, Google Sheets',
      ],
      price: 499.0,
      compareAtPrice: 850.0,
      type: 'EXCEL_TEMPLATE',
      averageRating: 4.9,
      totalReviews: 14,
      images: [
        { url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', altText: 'Calculator Preview' },
        { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', altText: 'Dashboard View' },
      ],
      reviews: [
        { id: 'r1', rating: 5, comment: 'Saves me hours of manual tax calculations every month. The ERCA formulas are 100% accurate for 2026 reporting.', user: { firstName: 'Kebede', lastName: 'T.' }, date: 'August 10, 2026', verified: true },
        { id: 'r2', rating: 5, comment: 'The automated payslip generation alone is worth the price. Clean, professional Excel work. Highly recommended!', user: { firstName: 'Sara', lastName: 'H.' }, date: 'August 8, 2026', verified: true },
        { id: 'r3', rating: 4, comment: 'Good tool overall. I wish it had Amharic-language payslip template option, but the English version works perfectly.', user: { firstName: 'Dawit', lastName: 'M.' }, date: 'August 5, 2026', verified: true },
      ],
    },
    'ethiopian-startup-handbook-ebook': {
      id: 'p2',
      name: 'The Ethiopian Startup Handbook: 0 to 1 Million ETB',
      slug: 'ethiopian-startup-handbook-ebook',
      brand: 'Bright Ideas Publishing',
      description: 'Step-by-step eBook for Ethiopian entrepreneurs.',
      aboutItem: [
        'Complete guide: business registration & trade license acquisition',
        'Step-by-step Chapa payment gateway integration guide',
        'Telegram channel growth & monetization strategies',
        'Sample legal contract templates and invoice formats included',
        'PDF format — read on any device',
      ],
      price: 350.0,
      compareAtPrice: 500.0,
      type: 'EBOOK',
      averageRating: 4.8,
      totalReviews: 8,
      images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', altText: 'Handbook Cover' }],
      reviews: [
        { id: 'r1', rating: 5, comment: 'Clear actionable steps on setting up Chapa and tax registration in Ethiopia.', user: { firstName: 'Dawit', lastName: 'M.' }, date: 'August 3, 2026', verified: true },
      ],
    },
  };

  const relatedProducts = [
    { id: 'p3', name: 'Complete Store Inventory & Sales Tracker (Excel System)', slug: 'complete-inventory-and-pos-excel-system', price: 750.0, compareAtPrice: 1200.0, type: 'BUSINESS_SYSTEM', averageRating: 5.0, totalReviews: 15, images: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }] },
    { id: 'p2', name: 'The Ethiopian Startup Handbook: 0 to 1 Million ETB', slug: 'ethiopian-startup-handbook-ebook', price: 350.0, compareAtPrice: 500.0, type: 'EBOOK', averageRating: 4.8, totalReviews: 8, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800' }] },
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchApi(`/api/products/${slug}`);
      if (res.success && res.data) {
        setProduct(res.data);
      } else {
        setProduct(fallbackProductMap[slug] || fallbackProductMap['ethiopian-tax-and-payroll-excel-calculator']);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div className="bg-white min-h-screen flex items-center justify-center text-sm text-[#565959]">Loading...</div>;
  if (!product) return <div className="bg-white min-h-screen flex items-center justify-center text-sm text-[#565959]">Product not found.</div>;

  const primaryImage = product.images?.[activeImageIndex]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800';
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, slug: product.slug, price: product.price, image: primaryImage });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchApi('/api/reviews', { method: 'POST', body: JSON.stringify({ productId: product.id, rating: revRating, comment: revComment }) });
    setRevSuccess('Thank you for your review!');
    setShowReviewModal(false);
    setRevComment('');
  };

  const ratingDistribution = [
    { stars: 5, pct: 85 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 5 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#007185] mb-4">
          <Link href="/" className="hover:text-[#c7511f] hover:underline">Bright Ideas</Link>
          <ChevronRight className="w-3 h-3 text-[#999]" />
          <Link href="/products" className="hover:text-[#c7511f] hover:underline">Digital Products</Link>
          <ChevronRight className="w-3 h-3 text-[#999]" />
          <span className="text-[#565959] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Amazon 3-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Col 1: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 flex gap-3">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveImageIndex(idx)}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-[52px] h-[52px] rounded border-2 overflow-hidden flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-[#e47911]' : 'border-[#d5d9d9] hover:border-[#e47911]'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main Image */}
            <div className="flex-1 border border-[#d5d9d9] rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <img src={primaryImage} alt={product.name} className="w-full max-h-[500px] object-contain" />
            </div>
          </div>

          {/* Col 2: Product Details (4 cols) */}
          <div className="lg:col-span-4">
            <h1 className="text-xl font-normal text-[#0f1111] leading-snug">{product.name}</h1>

            <div className="mt-1">
              <Link href="#" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
                Visit the {product.brand || 'Bright Ideas'} Store
              </Link>
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-2 mt-2 pb-3 border-b border-[#e3e6e6]">
              <span className="text-sm text-[#007185] font-medium">{product.averageRating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating) ? 'text-[#e47911] fill-current' : 'text-[#d5d9d9] fill-current'}`} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <Link href="#reviews" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
                {product.totalReviews} ratings
              </Link>
            </div>

            {/* Price */}
            <div className="mt-3">
              {discount && (
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[#cc0c39] text-2xl font-medium">-{discount}%</span>
                  <span className="text-[28px] font-light text-[#0f1111]">
                    <sup className="text-[13px] relative -top-[10px]">ETB</sup>
                    {Math.floor(product.price)}
                    <sup className="text-[13px] relative -top-[10px]">{(product.price % 1).toFixed(2).substring(1)}</sup>
                  </span>
                </div>
              )}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <p className="text-sm text-[#565959]">
                  List Price: <span className="line-through">ETB {product.compareAtPrice.toFixed(2)}</span>
                </p>
              )}
              {!discount && (
                <span className="text-[28px] font-light text-[#0f1111]">
                  <sup className="text-[13px] relative -top-[10px]">ETB</sup>
                  {Math.floor(product.price)}
                  <sup className="text-[13px] relative -top-[10px]">{(product.price % 1).toFixed(2).substring(1)}</sup>
                </span>
              )}
            </div>

            {/* Delivery Info */}
            <div className="mt-3 text-sm text-[#0f1111]">
              <span className="font-bold">Instant Digital Delivery</span> — download immediately after Chapa payment
            </div>

            <hr className="my-4 border-[#e3e6e6]" />

            {/* About this item */}
            <div>
              <h3 className="text-base font-bold text-[#0f1111] mb-2">About this item</h3>
              <ul className="space-y-1.5 text-sm text-[#0f1111] list-disc pl-5">
                {(product.aboutItem || [
                  'Professional digital tool for Ethiopian businesses',
                  'Instant download after purchase',
                  'ERCA 2026 compliant',
                ]).map((item: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Buy Box (3 cols) */}
          <div className="lg:col-span-3">
            <div className="border border-[#d5d9d9] rounded-lg p-5 space-y-3">
              <div className="text-[28px] font-light text-[#0f1111]">
                <sup className="text-[13px] relative -top-[10px]">ETB</sup>
                {Math.floor(product.price)}
                <sup className="text-[13px] relative -top-[10px]">{(product.price % 1).toFixed(2).substring(1)}</sup>
              </div>

              <p className="text-sm text-[#007185]">
                Inclusive of all taxes
              </p>

              <p className="text-sm">
                <span className="text-[#007600] font-bold">In Stock</span> — Instant digital delivery
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#0f1111]">Qty:</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-lg px-3 py-1.5 text-sm text-[#0f1111] shadow-sm cursor-pointer outline-none"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* Amazon Buttons */}
              <button
                onClick={handleAddToCart}
                className="w-full py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-medium text-[#0f1111] transition-colors"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-2 rounded-full bg-[#ffa41c] hover:bg-[#fa8900] text-sm font-medium text-[#0f1111] transition-colors"
              >
                Buy Now
              </button>

              {/* Secure Transaction */}
              <div className="flex items-center gap-1.5 text-xs text-[#565959] pt-2">
                <Lock className="w-3.5 h-3.5 text-[#565959]" />
                <span>Secure transaction via Chapa</span>
              </div>

              {/* Ship & Sold By */}
              <div className="text-xs text-[#565959] space-y-1 pt-2 border-t border-[#e3e6e6]">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="text-[#007185]">BrightIdeas.et</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-[#007185]">BrightIdeas.et</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span className="text-[#007185]">Chapa Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-[#e3e6e6]" />

        {/* Customer Reviews Section */}
        <div id="reviews" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Rating Histogram */}
          <div className="lg:col-span-4">
            <h2 className="text-lg font-bold text-[#0f1111]">Customer reviews</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#e47911] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-base font-medium text-[#0f1111]">{product.averageRating} out of 5</span>
            </div>
            <p className="text-sm text-[#565959] mt-1">{product.totalReviews} global ratings</p>

            {/* Bar Chart */}
            <div className="space-y-2 mt-4">
              {ratingDistribution.map((rd) => (
                <div key={rd.stars} className="flex items-center gap-2 text-sm">
                  <span className="text-[#007185] hover:text-[#c7511f] cursor-pointer whitespace-nowrap w-14">{rd.stars} star</span>
                  <div className="flex-1 bg-[#f0f2f2] h-[18px] rounded-sm overflow-hidden">
                    <div className="bg-[#ffa41c] h-full transition-all" style={{ width: `${rd.pct}%` }} />
                  </div>
                  <span className="text-[#007185] w-8 text-right">{rd.pct}%</span>
                </div>
              ))}
            </div>

            <hr className="my-5 border-[#e3e6e6]" />

            <h3 className="text-base font-bold text-[#0f1111]">Review this product</h3>
            <p className="text-sm text-[#565959] mt-1">Share your thoughts with other customers</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-3 w-full py-2 rounded-lg bg-white border border-[#d5d9d9] hover:bg-[#f7f8f8] text-sm text-[#0f1111] font-medium shadow-sm transition-colors"
            >
              Write a customer review
            </button>
          </div>

          {/* Review List */}
          <div className="lg:col-span-8">
            <h3 className="text-lg font-bold text-[#0f1111] mb-4">Top reviews from Ethiopia</h3>
            {revSuccess && <p className="text-sm text-[#007600] font-medium mb-3">{revSuccess}</p>}
            <div className="space-y-5">
              {(product.reviews || []).map((rev: any) => (
                <div key={rev.id} className="border-b border-[#e3e6e6] pb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-[#232f3e] text-white flex items-center justify-center text-sm font-bold">
                      {rev.user?.firstName?.[0] || 'U'}
                    </div>
                    <span className="text-sm text-[#0f1111]">{rev.user?.firstName} {rev.user?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-[#e47911] fill-current' : 'text-[#d5d9d9] fill-current'}`} viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {rev.verified && (
                    <span className="text-xs text-[#c7511f] font-bold">Verified Purchase</span>
                  )}
                  <p className="text-sm text-[#0f1111] mt-2 leading-relaxed">{rev.comment}</p>
                  {rev.date && <p className="text-xs text-[#565959] mt-2">Reviewed on {rev.date}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customers also bought */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-[#0f1111] mb-5">Customers who bought this item also bought</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-6 relative">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-[#565959] hover:text-[#0f1111]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#0f1111] mb-4">Create Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-2">Overall rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRevRating(star)}>
                      <svg className={`w-7 h-7 cursor-pointer ${revRating >= star ? 'text-[#e47911] fill-current' : 'text-[#d5d9d9] fill-current'}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0f1111] mb-2">Add a written review</label>
                <textarea
                  rows={5}
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="What did you like or dislike? How did you use this product?"
                  className="w-full border border-[#888c8c] rounded-md p-3 text-sm text-[#0f1111] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-bold text-[#0f1111] transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
