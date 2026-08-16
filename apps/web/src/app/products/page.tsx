'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../../components/storefront/product-card';
import { fetchApi } from '../../lib/api';
import { Search, ChevronDown, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('featured');
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

  const loadProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedType) params.set('type', selectedType);

    const prodRes = await fetchApi(`/api/products?${params.toString()}`);
    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data);
    } else {
      setProducts(fallbackProducts);
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, [selectedCategory, selectedType]);

  const filterTypes = [
    { key: '', label: 'All Types' },
    { key: 'EXCEL_TEMPLATE', label: 'Excel Templates' },
    { key: 'EBOOK', label: 'eBooks' },
    { key: 'BUSINESS_SYSTEM', label: 'Business Systems' },
  ];

  const resultCount = products.length;
  const activeFilters = [selectedCategory, selectedType].filter(Boolean);

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          
          {/* Left Sidebar Filters */}
          <aside className="space-y-5">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0f1111] mb-3">Department</h3>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedType(''); }}
                    className={`hover:text-[#c7511f] hover:underline ${!selectedCategory && !selectedType ? 'font-bold text-[#c7511f]' : 'text-[#0f1111]'}`}
                  >
                    All Digital Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory('excel-templates')}
                    className={`hover:text-[#c7511f] hover:underline ml-3 ${selectedCategory === 'excel-templates' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111]'}`}
                  >
                    Excel Calculators
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory('ebooks')}
                    className={`hover:text-[#c7511f] hover:underline ml-3 ${selectedCategory === 'ebooks' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111]'}`}
                  >
                    eBooks & Guides
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory('business-systems')}
                    className={`hover:text-[#c7511f] hover:underline ml-3 ${selectedCategory === 'business-systems' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111]'}`}
                  >
                    Business Systems
                  </button>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0f1111] mb-3">Customer Review</h3>
              <ul className="space-y-2 text-[13px] text-[#0f1111]">
                {[4, 3, 2, 1].map((stars) => (
                  <li key={stars} className="flex items-center gap-1.5 cursor-pointer hover:text-[#c7511f]">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < stars ? 'text-[#e47911] fill-current' : 'text-[#d5d9d9] fill-current'}`} viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs">& Up</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0f1111] mb-3">File Format</h3>
              <ul className="space-y-2 text-[13px]">
                {filterTypes.map((ft) => (
                  <li key={ft.key}>
                    <button
                      onClick={() => setSelectedType(ft.key)}
                      className={`hover:text-[#c7511f] hover:underline ${selectedType === ft.key ? 'font-bold text-[#c7511f]' : 'text-[#0f1111]'}`}
                    >
                      {ft.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            {/* Results Header Bar */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <form onSubmit={(e) => { e.preventDefault(); loadProducts(); }} className="relative">
                  <input
                    type="text"
                    placeholder="Search within results..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white text-sm text-[#0f1111] pl-9 pr-4 py-2 rounded-md border border-[#888c8c] focus:border-[#e47911] focus:shadow-[0_0_0_3px_rgba(228,121,17,0.3)] outline-none w-64"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#555]" />
                </form>
                <span className="text-sm text-[#565959]">
                  {loading ? 'Loading...' : `1-${resultCount} of ${resultCount} results`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#565959]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-md px-3 py-1.5 text-sm text-[#0f1111] focus:border-[#e47911] outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Avg. Customer Review</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-[#f0f2f2] text-xs text-[#0f1111] px-3 py-1.5 rounded-full border border-[#d5d9d9]">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="text-[#565959] hover:text-[#0f1111]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedType && (
                  <span className="inline-flex items-center gap-1 bg-[#f0f2f2] text-xs text-[#0f1111] px-3 py-1.5 rounded-full border border-[#d5d9d9]">
                    Type: {selectedType}
                    <button onClick={() => setSelectedType('')} className="text-[#565959] hover:text-[#0f1111]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => { setSelectedCategory(''); setSelectedType(''); }}
                  className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="text-center py-20 text-[#565959] text-sm">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-12 shadow-sm text-center">
                <h3 className="text-base font-bold text-[#0f1111]">No results found</h3>
                <p className="text-sm text-[#565959] mt-2">Try different keywords or remove some filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="bg-[#e3e6e6] min-h-screen flex items-center justify-center text-[#565959] text-sm">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
