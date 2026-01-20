import type { Metadata } from 'next';
import { Baloo_2, Quicksand, Dancing_Script } from 'next/font/google';
import Script from 'next/script';
import { Header, Footer, AnnouncementBar, CookieBanner } from '@/components/layout';
import './globals.css';

// Playful, cute font for headings (like Hannah heading style)
const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Friendly, rounded font for body text
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Decorative script font for special text
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" className={`${baloo.variable} ${quicksand.variable} ${dancingScript.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-418CY2STYC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-418CY2STYC');
          `}
        </Script>
      </head>
      <body className="font-body antialiased bg-white text-gray-900">
        <AnnouncementBar />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

