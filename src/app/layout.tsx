import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-prompt',
  display: 'swap',
});

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
      <body className={`${prompt.variable} font-sans`} suppressHydrationWarning={true} style={{ fontFamily: 'var(--font-prompt)' }}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
