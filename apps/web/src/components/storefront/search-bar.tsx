'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({
  className = '',
  defaultValue = '',
  placeholder = 'Search for eBooks, templates, business systems...',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full ${className}`}>
      <div className="relative flex flex-1 rounded-md overflow-hidden border-2 border-[#febd69] focus-within:border-[#f3a847] shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 text-sm text-[#0f1111] bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 bg-[#febd69] hover:bg-[#f3a847] transition-colors flex items-center justify-center"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-[#0f1111]" />
        </button>
      </div>
    </form>
  );
}
