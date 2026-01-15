import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
          {/* Image Side */}
          <div className="relative h-64 lg:h-auto order-1 lg:order-2">
            <Image
              src="/images/products/Tres-Leches-Cake.jpg"
              alt="Tres Leches Cake"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Side */}
          <div className="flex flex-col justify-center p-8 lg:p-16 order-2 lg:order-1 bg-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 font-serif">
              TRESLECHES CAKE
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Tres leches cake aka three milk cake is a Mexican dessert. It is
              an ultra soft and moist sponge cake topped with cream and fresh
              fruits.
            </p>
            <div className="mb-8">
              <Link href="/menu/tres-leches-cake">
                <Button size="lg">ORDER NOW</Button>
              </Link>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-3">
                Follow Us
              </p>
              <div className="flex space-x-4">
                <a
                  href={BUSINESS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#C9A86C] transition-colors"
                  aria-label="Follow on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={BUSINESS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#C9A86C] transition-colors"
                  aria-label="Follow on Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={BUSINESS.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#C9A86C] transition-colors"
                  aria-label="Follow on Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href={BUSINESS.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#C9A86C] transition-colors"
                  aria-label="Follow on LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
