import type { Metadata } from 'next';
import MenuClient from './MenuClient';

export const metadata: Metadata = {
  title: 'Our Menu - Cakes, Cupcakes & Desserts',
  description:
    'Browse our delicious selection of homemade cakes, cupcakes, cookies, and desserts. Order online for delivery across Greater Sydney. Ferrero Rocher, Tres Leches, Chocolate cakes and more!',
  keywords: [
    'cake menu Sydney',
    'order cakes online',
    'dessert menu',
    'cupcakes Sydney',
    'Ferrero Rocher cake',
    'Tres Leches cake',
    'chocolate cake Sydney',
  ],
  openGraph: {
    title: 'Our Menu - YUM by Maryam',
    description:
      'Browse our delicious selection of homemade cakes, cupcakes, cookies, and desserts.',
    url: 'https://yumbymaryam.com.au/menu',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'YUM by Maryam Menu',
      },
    ],
  },
  alternates: {
    canonical: 'https://yumbymaryam.com.au/menu',
  },
};

export default function MenuPage() {
  return <MenuClient />;
}

