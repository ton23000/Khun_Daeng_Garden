import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma'; // Added prisma to fetch setting

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const topBarSetting = await prisma.siteSetting.findUnique({
    where: { key: 'top_bar_text' }
  });
  const topBarBgSetting = await prisma.siteSetting.findUnique({
    where: { key: 'top_bar_bgColor' }
  });
  const topBarText = topBarSetting?.value || 'ฟรีปุ๋ยหมักเมื่อสั่งซื้อเกิน 1,000 บาท';
  const topBarBgColor = topBarBgSetting?.value || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prompt.variable} font-sans`} suppressHydrationWarning={true} style={{ fontFamily: 'var(--font-prompt)' }}>
        <Providers>
          <Navbar topBarText={topBarText} topBarBgColor={topBarBgColor} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
