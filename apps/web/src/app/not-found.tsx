import Link from 'next/link';
import { HelpCircle, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#e3e6e6] min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 shadow-md max-w-lg w-full text-center space-y-6 border border-gray-200">
        <div className="w-16 h-16 bg-[#febd69]/20 text-[#c7511f] rounded-full flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0f1111]">404 - Page Not Found</h1>
          <p className="text-sm text-[#565959] max-w-md mx-auto">
            Looking for something? The webpage or digital item you are looking for might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] font-bold text-sm rounded transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0f1111] font-semibold text-sm rounded transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
