'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Heart, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// AboutHero - Just "Yum By Maryam" with animated wave
export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      // Animate wave
      if (waveRef.current) {
        const wavePath = waveRef.current.querySelector('.wave-path');
        if (wavePath) {
          gsap.to(wavePath, {
            attr: {
              d: "M0,50 Q360,90 720,40 T1440,50 L1440,80 L0,80 Z"
            },
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }

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
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading mb-6">
          <span className="gradient-text">Yum By Maryam</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
          Where every dessert tells a story of love, passion, and the sweetest moments in life
        </p>
      </div>

      {/* Animated Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          ref={waveRef}
          viewBox="0 0 1440 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full"
          preserveAspectRatio="none"
        >
          <path 
            className="wave-path"
            d="M0,40 Q360,80 720,40 T1440,40 L1440,80 L0,80 Z" 
            fill="white" 
          />
        </svg>
      </div>
    </section>
  );
}

// AboutStory - From Kitchen to Your Heart with video background and box at front
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
    <section ref={sectionRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/3.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 via-pink-800/50 to-transparent" />
      </div>

      {/* Content Box at Front */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div 
          ref={contentRef}
          className="max-w-xl bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-pink-100"
        >
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-heading uppercase tracking-wider mb-4">
            Our Story
          </span>
          <h2 className="text-3xl lg:text-4xl font-heading mb-6">
            <span className="gradient-text">From Kitchen</span>
            <span className="text-gray-800"> to Your Heart</span>
          </h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed font-body">
            <p>
              YUM by Maryam was born from a simple dream — to share the joy of homemade 
              desserts with the world. What started as baking for family and friends in 
              our Sydney kitchen has blossomed into a beloved local bakery.
            </p>
            <p>
              Every cake we create carries a piece of our heart. We believe that the 
              best desserts are made with love, patience, and the finest ingredients.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-pink-600">
            <Heart className="w-5 h-5 fill-pink-600" />
            <span className="font-heading">Finalist - Local Business Awards 2021</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Floating Product Image Section between From Kitchen and Maryam Arafat
export function AboutFloatingProduct() {
  const sectionRef = useRef<HTMLElement>(null);
  const custardRef = useRef<HTMLDivElement>(null);
  const custardBackRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Custard image floating animation
      if (custardRef.current) {
        gsap.to(custardRef.current, {
          x: 25,
          y: -20,
          rotation: 10,
          scale: 1.05,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (custardBackRef.current) {
        gsap.to(custardBackRef.current, {
          x: -18,
          y: 12,
          rotation: -8,
          scale: 1.1,
          duration: 6.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Background shapes
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-20, 20)`,
            duration: 6 + index * 0.7,
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
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-gradient-merged">
      {/* Background Shapes with different color combinations */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        {/* Shape 1 */}
        <div className="absolute top-20 left-1/4">
          <div className="w-20 h-20 rounded-full bg-white/70" />
          <div className="absolute inset-2 w-14 h-14 rounded-full" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 100%)' }} />
        </div>
        {/* Shape 2 */}
        <div className="absolute bottom-1/3 right-20">
          <div className="w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 100%)' }} />
          <div className="absolute inset-2 w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E91E63 100%)' }} />
        </div>
        {/* Shape 3 */}
        <div className="absolute top-1/2 left-10">
          <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FFC0CB 100%)' }} />
          <div className="absolute inset-1 w-8 h-8 rounded-full bg-white/80" />
        </div>
        {/* Large blurs */}
        <div className="absolute top-10 right-1/4 w-52 h-52 bg-pink-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      {/* Center floating product image */}
      <div className="flex justify-center items-center relative z-10">
        {/* Splash shape */}
        <div className="absolute w-56 h-56 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path 
              fill="#E91E63" 
              d="M44.7,-76.4C58.1,-68.5,69.4,-56.6,77.1,-42.6C84.8,-28.6,88.9,-12.5,87.3,2.9C85.8,18.4,78.6,33.2,68.7,45.4C58.8,57.6,46.2,67.3,32.2,73.6C18.1,80,-2.5,83,-21.3,79.1C-40.2,75.2,-57.3,64.4,-69.8,50.1C-82.3,35.8,-90.2,17.9,-89.6,0.3C-89,-17.2,-79.9,-34.4,-67.5,-47.7C-55.1,-61,-39.4,-70.4,-23.6,-76.8C-7.8,-83.2,8.1,-86.6,23.4,-84.2C38.8,-81.8,53.6,-73.6,44.7,-76.4Z" 
              transform="translate(100 100)"
            />
          </svg>
        </div>
        {/* Back circle */}
        <div 
          ref={custardBackRef}
          className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)'
          }}
        />
        {/* Front circle */}
        <div 
          className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)'
          }}
        />
        {/* Custard image */}
        <div ref={custardRef} className="relative w-44 h-44 md:w-60 md:h-60">
          <Image
            src="/images/products/custard2final.png"
            alt="Custard dessert"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

// AboutFounder - Meet Maryam Arafat with photo
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
          {/* Image - Founder Photo */}
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105 rotate-3" />
            <div 
              className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-pink-100 to-white"
              style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            >
              {/* Placeholder for founder photo - using video for now */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-square object-cover"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-heading uppercase tracking-wider mb-4">
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
              className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-pink-100"
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
