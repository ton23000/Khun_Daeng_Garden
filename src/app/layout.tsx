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
  title: 'สวนคุณแดงการ์เด้น (Khun Daeng Garden) - รับจัดสวน ขายต้นไม้พรีเมียม',
  description: 'ศูนย์จำหน่ายต้นไม้มงคล ไม้ประดับ ต้นไม้ตกแต่งบ้าน และบริการรับจัดสวนแบบครบวงจรโดยผู้เชี่ยวชาญจาก สวนคุณแดงการ์เด้น (Khun Daeng Garden)',
  keywords: ['ขายต้นไม้', 'รับจัดสวน', 'ต้นไม้มงคล', 'ไม้ประดับ', 'คุณแดงการ์เด้น', 'Khun Daeng Garden', 'ต้นไม้ตกแต่งบ้าน', 'ร้านขายต้นไม้ ลำปาง'],
  openGraph: {
    title: 'สวนคุณแดงการ์เด้น - รับจัดสวน ขายต้นไม้พรีเมียม',
    description: 'ศูนย์จำหน่ายต้นไม้มงคล ไม้ประดับ และบริการรับจัดสวนแบบครบวงจร',
    url: 'https://www.khundaenggarden.com',
    siteName: 'Khun Daeng Garden',
    images: [
      {
        url: '/images/og-image.jpg', // Placeholder, ensure to add an actual image here later
        width: 1200,
        height: 630,
        alt: 'สวนคุณแดงการ์เด้น',
      }
    ],
    locale: 'th_TH',
    type: 'website',
  }
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
