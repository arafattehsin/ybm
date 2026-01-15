import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D2D2D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href={BUSINESS.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C9A86C] transition-colors"
            aria-label="Follow on Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href={BUSINESS.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C9A86C] transition-colors"
            aria-label="Follow on Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href={BUSINESS.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C9A86C] transition-colors"
            aria-label="Follow on Twitter"
          >
            <Twitter size={24} />
          </a>
          <a
            href={BUSINESS.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C9A86C] transition-colors"
            aria-label="Follow on LinkedIn"
          >
            <Linkedin size={24} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            Copyright {currentYear} © {BUSINESS.name}
          </p>
          <p className="mt-1">ABN - {BUSINESS.abn}</p>
        </div>
      </div>
    </footer>
  );
}
