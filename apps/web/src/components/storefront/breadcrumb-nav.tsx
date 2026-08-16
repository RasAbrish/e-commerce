'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-[#565959] py-2 px-4 overflow-x-auto whitespace-nowrap">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#c7511f] hover:underline shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-[#c7511f] hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#0f1111] font-medium truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
