import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/lib/AuthContext';
import { NotificationProvider } from '@/lib/NotificationContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Khun Daeng Garden - Premium Tree Shop',
  description: 'Find and book your perfect tree at Khun Daeng Garden.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html >
  );
}
