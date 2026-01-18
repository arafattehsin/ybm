'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { BUSINESS } from '@/lib/constants';
import gsap from 'gsap';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalItems());
  const headerRef = useRef<HTMLElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted && headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      
      navItemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(item,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.3 + index * 0.1, ease: 'power2.out' }
          );
        }
      });
    }
  }, [mounted]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/menu', label: 'Menu' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header 
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-nav'
      }`}
    >
      {/* Curved bottom shape */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-200 via-white to-pink-200 rounded-b-[50%] transform translate-y-1/2 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt={BUSINESS.name}
                width={140}
                height={56}
                className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                ref={(el) => { navItemsRef.current[index] = el; }}
                href={link.href}
                className="relative px-5 py-2 text-gray-700 font-medium transition-all duration-300 hover:text-pink-600 group"
              >
                {link.label}
                {/* Hover underline animation */}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-300 group-hover:w-3/4 group-hover:left-[12.5%] rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2">
            {/* User Account */}
            <Link
              href="/account"
              className="relative p-3 text-gray-600 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-full group"
              aria-label="User account"
            >
              <User size={22} className="transition-transform duration-300 group-hover:scale-110" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-3 text-gray-600 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-full group"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={22} className="transition-transform duration-300 group-hover:scale-110" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="border-t border-pink-100 py-4 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-white hover:text-pink-600 rounded-xl transition-all duration-300 font-heading font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

