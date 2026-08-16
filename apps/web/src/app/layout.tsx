import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/storefront/header';
import { Footer } from '../components/storefront/footer';
import { CartSheet } from '../components/storefront/cart-sheet';
import { QueryProvider } from '../providers/query-provider';
import { AuthProvider } from '../providers/auth-provider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'BrightIdeas.et — Digital Products for Ethiopian Business',
  description: 'Purchase verified Ethiopian tax calculators, payroll Excel tools, business eBooks, and systems. Instant downloads with Chapa payment gateway.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#e3e6e6] text-[#0f1111] min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <CartSheet />
            <Footer />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

