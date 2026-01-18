'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate background shapes
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-20, 20)`,
            x: `random(-15, 15)`,
            rotation: `random(-10, 10)`,
            duration: 5 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/menu', label: 'Menu' },
    { href: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { href: BUSINESS.social.facebook, icon: Facebook, label: 'Facebook' },
    { href: BUSINESS.social.instagram, icon: Instagram, label: 'Instagram' },
    { href: BUSINESS.social.twitter, icon: Twitter, label: 'Twitter' },
    { href: BUSINESS.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer ref={footerRef} className="relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF0F5 25%, #FFB6C1 50%, #FFC0CB 75%, #FFFFFF 100%)'
    }}>
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 -mt-1">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,30 Q360,60 720,30 T1440,30 L1440,0 L0,0 Z" fill="#FCE4EC" />
        </svg>
      </div>

      {/* Background Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-200/30 rounded-full blur-xl" />
        {/* Small circles with gradients */}
        <div className="absolute top-24 right-1/4 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-white opacity-40" />
        <div className="absolute bottom-32 left-1/4 w-6 h-6 rounded-full bg-gradient-to-br from-white to-pink-300 opacity-50" />
        <div className="absolute top-1/3 right-10 w-5 h-5 rounded-full bg-pink-400/40" />
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt={BUSINESS.name}
                  width={150}
                  height={60}
                  className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-pink-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
            <p className="text-gray-700 mb-6 leading-relaxed font-body">
              Crafting delightful homemade cakes, cupcakes, and desserts with love from Sydney. Every creation is a celebration.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg border border-pink-200"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading mb-6 text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-pink-600 transition-colors duration-300 flex items-center gap-2 group font-body"
                  >
                    <span className="w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading mb-6 text-gray-800">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700 font-body">
                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                <span>{BUSINESS.location}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-body">
                <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-pink-600 transition-colors">
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-700 font-body">
                <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span>Order via Instagram DM</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-heading mb-6 text-gray-800">We Accept</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Visa */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-pink-100">
                <svg viewBox="0 0 48 32" className="h-6 w-auto">
                  <rect fill="#1A1F71" width="48" height="32" rx="4"/>
                  <text x="24" y="20" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">VISA</text>
                </svg>
              </div>
              {/* Mastercard */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-pink-100">
                <svg viewBox="0 0 48 32" className="h-6 w-auto">
                  <rect fill="#EB001B" x="8" y="6" width="20" height="20" rx="10"/>
                  <rect fill="#F79E1B" x="20" y="6" width="20" height="20" rx="10"/>
                  <rect fill="#FF5F00" x="20" y="6" width="8" height="20"/>
                </svg>
              </div>
              {/* PayPal */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-pink-100">
                <svg viewBox="0 0 48 32" className="h-6 w-auto">
                  <rect fill="#003087" width="48" height="32" rx="4"/>
                  <text x="24" y="18" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">PayPal</text>
                </svg>
              </div>
              {/* Stripe */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-pink-100">
                <svg viewBox="0 0 48 32" className="h-6 w-auto">
                  <rect fill="#635BFF" width="48" height="32" rx="4"/>
                  <text x="24" y="18" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">stripe</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-pink-200/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left font-body">
              © {currentYear} {BUSINESS.name}. All rights reserved. ABN: {BUSINESS.abn}
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-1 font-body">
              Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" /> in Sydney
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
