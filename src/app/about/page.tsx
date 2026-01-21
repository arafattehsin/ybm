import type { Metadata } from 'next';
import { AboutHero, AboutStory, AboutFloatingProduct, AboutFounder, AboutValues } from '@/components/about';
import { PageTransition } from '@/components/layout';

export const metadata: Metadata = {
  title: 'About Us | YUM by Maryam',
  description: 'Learn about YUM by Maryam - our story, our passion for baking, and the love we put into every dessert we create.',
  alternates: {
    canonical: 'https://yumbymaryam.com.au/about',
  },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <AboutHero />
      <AboutStory />
      <AboutFloatingProduct />
      <AboutFounder />
      <AboutValues />
    </PageTransition>
  );
}

