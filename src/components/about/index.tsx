'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// AboutHero - Just "Yum By Maryam" without animations and wave
export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-15, 15)`,
            duration: 5 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-100/40 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/50 rounded-full blur-xl" />
        <Sparkles className="absolute top-1/4 right-1/4 w-8 h-8 text-pink-300/40" />
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading mb-6">
          <span className="gradient-text">Yum By Maryam</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
          Where every dessert tells a story of love, passion, and the sweetest moments in life
        </p>
      </div>
    </section>
  );
}

// AboutStory - From Kitchen to Your Heart with video background behind title - larger content box
export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Video Background - Behind everything */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/3.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay for video behind title */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-pink-800/60 to-pink-700/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30" />
      </div>

      {/* Content Box at Front - Larger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 flex justify-center">
        <div 
          ref={contentRef}
          className="max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl p-12 lg:p-14 shadow-2xl border border-pink-100 text-center"
        >
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-heading uppercase tracking-wider mb-4">
            Our Story
          </span>
          <h2 className="text-3xl lg:text-5xl font-heading mb-6">
            <span className="gradient-text">From Kitchen</span>
            <span className="text-gray-800"> to Your Heart</span>
          </h2>
          <div className="space-y-5 text-gray-600 text-lg lg:text-xl leading-relaxed font-body">
            <p>
              YUM by Maryam was born from a simple dream — to share the joy of homemade 
              desserts with the world. What started as baking for family and friends in 
              our Sydney kitchen has blossomed into a beloved local bakery.
            </p>
            <p>
              Every cake we create carries a piece of our heart. We believe that the 
              best desserts are made with love, patience, and the finest ingredients.
            </p>
            <p>
              From birthdays to weddings, from small gatherings to grand celebrations, 
              we&apos;re honored to be part of your most cherished moments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// AboutFloatingProduct - REMOVED - now empty component
export function AboutFloatingProduct() {
  return null;
}

// AboutFounder - Meet Maryam Arafat with photo and bakery shapes
export function AboutFounder() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-20, 20)`,
            x: `random(-15, 15)`,
            rotation: `random(-10, 10)`,
            duration: 4 + index,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-gradient-merged">
      {/* Background Bakery Shapes - Hidden on mobile */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Cupcake */}
        <div className="absolute top-20 right-20">
          <svg viewBox="0 0 64 64" className="w-16 h-16 text-pink-300/30" fill="currentColor">
            <path d="M16 28c0-8 6-14 16-14s16 6 16 14c0 2-1 4-2 5h-28c-1-1-2-3-2-5z" />
            <path d="M14 35h36c1 0 2 1 2 2l-4 22c0 2-2 3-4 3H20c-2 0-4-1-4-3l-4-22c0-1 1-2 2-2z" />
            <circle cx="32" cy="18" r="4" />
          </svg>
        </div>
        {/* Donut */}
        <div className="absolute bottom-20 left-10">
          <svg viewBox="0 0 64 64" className="w-12 h-12 text-pink-400/25" fill="currentColor">
            <path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 40c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" />
          </svg>
        </div>
        {/* Cake slice */}
        <div className="absolute top-1/3 left-16">
          <svg viewBox="0 0 64 64" className="w-10 h-10 text-pink-200/40" fill="currentColor">
            <path d="M8 48l24-40 24 40c0 4-4 8-12 8H20c-8 0-12-4-12-8z" />
          </svg>
        </div>
        {/* Croissant */}
        <div className="absolute bottom-1/3 right-16">
          <svg viewBox="0 0 64 64" className="w-14 h-14 text-pink-300/35" fill="currentColor">
            <path d="M8 40c4-20 16-28 24-28 4 0 10 2 16 8 6 6 8 12 8 16 0 8-8 12-16 8-4-2-8-1-12 2-8 6-22 4-20-6z" />
          </svg>
        </div>
        {/* Large blurs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-pink-100/40 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image - Maryam's Photo */}
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105 rotate-3" />
            <div 
              className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-pink-100 to-white"
              style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            >
              {/* Maryam's actual photo */}
              <Image
                src="/images/maryam.jpeg"
                alt="Maryam Arafat - Founder of YUM by Maryam"
                width={600}
                height={600}
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm text-pink-600 rounded-full text-sm font-heading uppercase tracking-wider mb-4 shadow-sm">
              Meet The Founder
            </span>
            <h2 className="text-4xl lg:text-5xl font-heading mb-6">
              <span className="gradient-text">Maryam Arafat</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed font-body">
              <p>
                Hi, I&apos;m Maryam! Baking has been my passion for as long as I can remember. 
                Growing up, my kitchen was always filled with the aroma of fresh cakes and 
                the sound of laughter as we shared our creations with loved ones.
              </p>
              <p>
                What makes YUM special? It&apos;s the personal touch. I work closely with each 
                customer to understand their vision and bring it to life. Whether it&apos;s a 
                birthday cake, wedding dessert, or just a sweet treat to brighten your day — 
                every order is crafted with the same love and attention to detail.
              </p>
              <p>
                Thank you for being part of this journey. Every order, every smile, every 
                celebration shared makes this dream more beautiful than I ever imagined.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Star className="w-8 h-8 fill-white" />
              </div>
              <div>
                <p className="font-heading text-gray-900 text-lg">Maryam Arafat</p>
                <p className="text-pink-600 font-body">Creating sweet memories since 2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// AboutValues - Our values section
export function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: '💝',
      title: 'Made with Love',
      description: 'Every dessert is crafted with genuine care and passion, just like we would for our own family.'
    },
    {
      icon: '🌟',
      title: 'Quality First',
      description: 'We use only the finest ingredients, sourced locally where possible, to ensure exceptional taste.'
    },
    {
      icon: '🎨',
      title: 'Creative Excellence',
      description: 'From classic recipes to custom creations, we bring artistry and innovation to every order.'
    },
    {
      icon: '🤝',
      title: 'Community Focus',
      description: 'We&apos;re proud to be part of the Sydney community, celebrating your special moments together.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-gradient-merged">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 bg-white/80 text-pink-600 rounded-full text-sm font-heading uppercase tracking-wider mb-4">
            Our Values
          </span>
          <h2 className="text-4xl lg:text-5xl font-heading">
            <span className="gradient-text">What We</span>
            <span className="text-gray-800"> Stand For</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-pink-100"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-heading text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 font-body">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
