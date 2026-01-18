'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

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

      <div ref={titleRef} className="relative z-10 text-center px-4">
        <span className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-6 shadow-sm">
          Our Story
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-6">
          <span className="gradient-text">About</span>
          <span className="text-gray-800"> YUM by Maryam</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Where every dessert tells a story of love, passion, and the sweetest moments in life
        </p>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,40 Q360,80 720,40 T1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: -50 },
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

      gsap.fromTo(imageRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={contentRef}>
            <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
              How It Started
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              <span className="gradient-text">From Kitchen</span>
              <span className="text-gray-800"> to Your Heart</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                YUM by Maryam was born from a simple dream — to share the joy of homemade 
                desserts with the world. What started as baking for family and friends in 
                our Sydney kitchen has blossomed into a beloved local bakery.
              </p>
              <p>
                Every cake we create carries a piece of our heart. We believe that the 
                best desserts are made with love, patience, and the finest ingredients. 
                That&apos;s why we never compromise on quality.
              </p>
              <p>
                In 2021, we were honoured to be named a finalist in the Local Business 
                Awards in Parramatta — a testament to our commitment to excellence and 
                the support of our amazing community.
              </p>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-400 rounded-3xl blur-xl opacity-30 transform scale-105" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[4/3] object-cover"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-pink-100/40 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105 rotate-3" />
            <div 
              className="relative overflow-hidden shadow-2xl"
              style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-square object-cover"
              >
                <source src="/videos/3.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
              Meet The Founder
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              <span className="gradient-text">Maryam Arafat</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
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
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                M
              </div>
              <div>
                <p className="font-bold text-gray-900">Maryam Arafat</p>
                <p className="text-pink-600">Founder & Head Baker</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Our Values
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif">
            <span className="gradient-text">What We</span>
            <span className="text-gray-800"> Stand For</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-pink-100"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
