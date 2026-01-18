import type { Metadata } from 'next';
import { AboutHero, AboutStory, AboutFounder, AboutValues } from '@/components/about';

export const metadata: Metadata = {
  title: 'About Us | YUM by Maryam',
  description: 'Learn about YUM by Maryam - our story, our passion for baking, and the love we put into every dessert we create.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutValues />
    </>
  );
}
