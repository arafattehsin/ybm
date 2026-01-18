'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Heart, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SeasonalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const chocoRef = useRef<HTMLDivElement>(null);
  const chocoBackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
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

      // Video animation
      gsap.fromTo(videoRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Choco image floating animation
      if (chocoRef.current) {
        gsap.to(chocoRef.current, {
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

      // Choco back circle animation
      if (chocoBackRef.current) {
        gsap.to(chocoBackRef.current, {
          x: -15,
          y: 15,
          rotation: -8,
          scale: 1.1,
          duration: 6.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Background shapes - different colors and patterns
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-20, 20)`,
            duration: 6 + index * 0.8,
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
    <section ref={sectionRef} className="relative py-28 lg:py-36 overflow-hidden bg-gradient-merged">
      {/* Floating Choco Image at Top Left - merging with previous section */}
      <div className="absolute -top-24 left-8 lg:left-16 z-[9999]">
        {/* Splash shape */}
        <div className="absolute -top-8 -left-8 w-40 h-40 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path 
              fill="#FF4081" 
              d="M39.5,-65.3C50.9,-58.3,59.4,-46.4,65.4,-33.4C71.4,-20.3,74.9,-6.1,73.1,7.4C71.3,20.9,64.2,33.6,54.5,43.7C44.8,53.8,32.4,61.3,18.7,66.2C5,71.1,-10,73.4,-23.8,70.3C-37.6,67.2,-50.2,58.7,-59.3,47.1C-68.4,35.5,-74,20.8,-74.9,5.8C-75.8,-9.2,-72,-24.5,-63.8,-36.5C-55.6,-48.5,-43,-57.2,-29.8,-63.2C-16.6,-69.2,-2.8,-72.5,10.4,-71.3C23.6,-70.1,28.1,-72.3,39.5,-65.3Z" 
              transform="translate(100 100)"
            />
          </svg>
        </div>
        {/* Back circle - white with pink gradient */}
        <div 
          ref={chocoBackRef}
          className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full -top-6 -left-6"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)'
          }}
        />
        {/* Front circle - pink with white */}
        <div 
          className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full top-0 left-0"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)'
          }}
        />
        {/* Choco image */}
        <div ref={chocoRef} className="relative w-32 h-32 md:w-44 md:h-44">
          <Image
            src="/images/products/chocofinal.png"
            alt="Chocolate dessert"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Background Decorative Shapes with Different Colors */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        {/* Shape 1 - pink/white gradient front, white back */}
        <div className="absolute top-20 left-1/4">
          <div className="w-20 h-20 rounded-full bg-white/60 blur-sm" />
          <div className="absolute inset-1 w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)' }} />
        </div>
        {/* Shape 2 - white front, pink back */}
        <div className="absolute bottom-1/3 right-1/4">
          <div className="w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #E91E63 100%)' }} />
          <div className="absolute inset-1 w-12 h-12 rounded-full bg-white/80" />
        </div>
        {/* Shape 3 - reversed gradient */}
        <div className="absolute top-1/2 left-10">
          <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 100%)' }} />
          <div className="absolute inset-1 w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FFFFFF 100%)' }} />
        </div>
        {/* Shape 4 */}
        <div className="absolute bottom-20 left-1/3">
          <div className="w-14 h-14 rounded-full bg-pink-200/50" />
          <div className="absolute inset-1 w-10 h-10 rounded-full bg-white/70" />
        </div>
        {/* Large blur shapes */}
        <div className="absolute top-10 right-20 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
        {/* Small floating elements */}
        <Heart className="absolute top-1/4 right-1/3 w-6 h-6 text-pink-300/50" />
        <Sparkles className="absolute bottom-1/3 left-1/5 w-5 h-5 text-pink-400/40" />
        <Gift className="absolute top-2/3 right-1/5 w-8 h-8 text-pink-200/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Content Side - Wider and overlaps video */}
          <div ref={contentRef} className="relative lg:col-span-7 z-20">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-pink-100 lg:-mr-24">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading mb-6 leading-tight">
                <span className="gradient-text">Perfect Time</span>
                <br />
                <span className="text-gray-800">to Send Gifts</span>
              </h2>

              <p className="text-gray-600 text-lg lg:text-xl mb-8 leading-relaxed font-body">
                Nothing says &quot;I love you&quot; quite like a handcrafted sweet treat. 
                Whether it&apos;s a birthday surprise, anniversary celebration, or just 
                because — let our desserts carry your warmest wishes.
              </p>

              <Link href="/menu">
                <button className="btn-gradient px-8 py-4 rounded-full font-heading text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                  <span className="flex items-center gap-2">
                    Order Now
                    <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Video Side - In front */}
          <div ref={videoRef} className="relative lg:col-span-5 z-30">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[4/3] object-cover"
              >
                <source src="/videos/3.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

