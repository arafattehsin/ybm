import type { Metadata } from 'next';
import { ContactSection } from '@/components/contact';

export const metadata: Metadata = {
  title: 'Contact Us | YUM by Maryam',
  description: 'Get in touch with YUM by Maryam. We\'d love to hear from you about custom orders, inquiries, or just to say hello!',
};

export default function ContactPage() {
  return <ContactSection />;
}
