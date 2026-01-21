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
  metadataBase: new URL('https://yumbymaryam.com.au'),
  title: {
    default: 'YUM by Maryam - Homemade Cakes & Desserts Sydney',
    template: '%s | YUM by Maryam',
  },
  description:
    'Delicious homemade cakes, cupcakes, cookies, and desserts made with love. Order online for delivery across Greater Sydney.',
  keywords: [
    'homemade cakes Sydney',
    'cupcakes Sydney',
    'desserts Sydney',
    'birthday cake delivery',
    'custom cakes',
    'YUM by Maryam',
    'bakery Sydney',
    'cake delivery Sydney',
    'Ferrero Rocher cake',
    'Tres Leches cake',
  ],
  authors: [{ name: 'YUM by Maryam' }],
  creator: 'YUM by Maryam',
  publisher: 'YUM by Maryam',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'YUM by Maryam - Homemade Cakes & Desserts Sydney',
    description:
      'Delicious homemade cakes, cupcakes, cookies, and desserts made with love. Order online for delivery across Greater Sydney.',
    url: 'https://yumbymaryam.com.au',
    siteName: 'YUM by Maryam',
    type: 'website',
    locale: 'en_AU',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'YUM by Maryam - Homemade Cakes & Desserts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YUM by Maryam - Homemade Cakes & Desserts Sydney',
    description:
      'Delicious homemade cakes, cupcakes, cookies, and desserts made with love.',
    images: ['/images/logo.png'],
    creator: '@yumbymaryam',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  verification: {
    google: 'G-418CY2STYC',
  },
  alternates: {
    canonical: 'https://yumbymaryam.com.au',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://yumbymaryam.com.au/#organization',
        name: 'YUM by Maryam',
        url: 'https://yumbymaryam.com.au',
        logo: {
          '@type': 'ImageObject',
          url: 'https://yumbymaryam.com.au/images/logo.png',
        },
        sameAs: [
          'https://instagram.com/yumbymaryam',
          'https://fb.com/yumbymaryam',
          'https://www.linkedin.com/company/yumbymaryam/',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@yumbymaryam.com.au',
          contactType: 'customer service',
          areaServed: 'AU',
          availableLanguage: 'English',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://yumbymaryam.com.au/#localbusiness',
        name: 'YUM by Maryam',
        image: 'https://yumbymaryam.com.au/images/logo.png',
        '@additionalType': 'https://schema.org/Bakery',
        description: 'Delicious homemade cakes, cupcakes, cookies, and desserts made with love. Order online for delivery across Greater Sydney.',
        url: 'https://yumbymaryam.com.au',
        email: 'hello@yumbymaryam.com.au',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sydney',
          addressRegion: 'NSW',
          addressCountry: 'AU',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -33.8688,
          longitude: 151.2093,
        },
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: -33.8688,
            longitude: 151.2093,
          },
          geoRadius: '50000',
        },
        priceRange: '$$',
        servesCuisine: 'Bakery, Desserts, Cakes',
        paymentAccepted: 'Credit Card, Debit Card',
        currenciesAccepted: 'AUD',
        sameAs: [
          'https://instagram.com/yumbymaryam',
          'https://fb.com/yumbymaryam',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://yumbymaryam.com.au/#website',
        url: 'https://yumbymaryam.com.au',
        name: 'YUM by Maryam',
        description: 'Homemade cakes and desserts in Sydney',
        publisher: {
          '@id': 'https://yumbymaryam.com.au/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://yumbymaryam.com.au/menu?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${baloo.variable} ${quicksand.variable} ${dancingScript.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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

