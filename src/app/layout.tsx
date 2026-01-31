import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/lib/AuthContext';
import { NotificationProvider } from '@/lib/NotificationContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning={true} style={{ fontFamily: 'var(--font-inter)' }}>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html >
  );
}
