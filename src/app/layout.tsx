import type { Metadata } from 'next';
import { Playfair_Display, Open_Sans } from 'next/font/google';
import { Header, Footer, AnnouncementBar, CookieBanner } from '@/components/layout';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YUM by Maryam - Homemade Cakes & Desserts Sydney',
  description:
    'Delicious homemade cakes, cupcakes, cookies, and desserts made with love. Order online for delivery across Greater Sydney.',
  keywords: [
    'homemade cakes Sydney',
    'cupcakes Sydney',
    'desserts Sydney',
    'birthday cake delivery',
    'custom cakes',
    'YUM by Maryam',
  ],
  openGraph: {
    title: 'YUM by Maryam - Homemade Cakes & Desserts Sydney',
    description:
      'Delicious homemade cakes, cupcakes, cookies, and desserts made with love.',
    url: 'https://yumbymaryam.com.au',
    siteName: 'YUM by Maryam',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YUM by Maryam - Homemade Cakes & Desserts Sydney',
    description:
      'Delicious homemade cakes, cupcakes, cookies, and desserts made with love.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${openSans.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <AnnouncementBar />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
