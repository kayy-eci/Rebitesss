import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Be_Vietnam_Pro, Dancing_Script } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  preload: false,
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  preload: false,
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
  weight: ['500', '600', '700'],
  style: ['normal'],
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ReBites - Selamatkan Makanan Surplus, Kurangi Food Waste',
  description:
    'Marketplace yang mempertemukan pelaku UMKM kuliner dengan pembeli untuk menyelamatkan makanan surplus yang masih layak konsumsi. Dari dapur UMKM, ke piring yang butuh.',
  openGraph: {
    title: 'ReBites - Selamatkan Makanan Surplus',
    description:
      'Marketplace makanan surplus untuk UMKM kuliner. Kurangi food waste, hemat pengeluaran.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${beVietnamPro.variable} ${dancingScript.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
