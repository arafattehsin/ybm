'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Real Instagram post IDs from @yumbymaryam - replace with actual post shortcodes
const instagramPosts = [
  { id: 1, shortcode: 'C0nNVc8Nqkv' },
  { id: 2, shortcode: 'C0nNVc8Nqkv' },
  { id: 3, shortcode: 'C0nNVc8Nqkv' },
  { id: 4, shortcode: 'C0nNVc8Nqkv' },
  { id: 5, shortcode: 'C0nNVc8Nqkv' },
  { id: 6, shortcode: 'C0nNVc8Nqkv' },
];

export function InstagramSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const choco2Ref = useRef<HTMLDivElement>(null);
  const choco2BackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Video animation
      gsap.fromTo(videoRef.current,
        { opacity: 0, scale: 0.9, rotation: -5 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Grid items stagger animation
      if (gridRef.current) {
        const items = gridRef.current.children;
        gsap.fromTo(items,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Choco2 image floating animation
      if (choco2Ref.current) {
        gsap.to(choco2Ref.current, {
          x: 20,
          y: -18,
          rotation: 7,
          scale: 1.04,
          duration: 5.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Choco2 back circle animation
      if (choco2BackRef.current) {
        gsap.to(choco2BackRef.current, {
          x: -12,
          y: 10,
          rotation: -5,
          scale: 1.08,
          duration: 6.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Background shapes animation
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-25, 25)`,
            x: `random(-20, 20)`,
            rotation: `random(-15, 15)`,
            duration: 5 + index * 0.6,
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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-gradient-merged pb-0">
      {/* Floating Choco2 Image at Top Left - merging with previous section */}
      <div className="absolute -top-20 left-8 lg:left-20 z-[9999]">
        {/* Splash shape */}
        <div className="absolute -top-6 -left-6 w-36 h-36 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path 
              fill="#FF4081" 
              d="M47.5,-57.2C59.1,-48.2,64.8,-31.5,67.4,-14.5C70,2.6,69.5,20,62.3,34.1C55.1,48.2,41.2,59,25.6,65.3C10,71.6,-7.3,73.4,-23.4,68.7C-39.5,64,-54.4,52.8,-63.6,37.8C-72.8,22.8,-76.3,3.9,-72.5,-12.8C-68.7,-29.5,-57.6,-44,-43.9,-52.8C-30.2,-61.6,-14,-64.7,1.9,-67C17.8,-69.3,35.9,-66.2,47.5,-57.2Z" 
              transform="translate(100 100)"
            />
          </svg>
        </div>
        {/* Back circle */}
        <div 
          ref={choco2BackRef}
          className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full -top-4 -left-4"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)'
          }}
        />
        {/* Front circle */}
        <div 
          className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full top-0 left-0"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)'
          }}
        />
        {/* Choco2 image */}
        <div ref={choco2Ref} className="relative w-28 h-28 md:w-36 md:h-36">
          <Image
            src="/images/products/chocofinal2.png"
            alt="Chocolate dessert"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Background Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        {/* Shape pairs */}
        <div className="absolute top-40 right-20">
          <div className="w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #E91E63 100%)' }} />
          <div className="absolute inset-1 w-12 h-12 rounded-full bg-white/70" />
        </div>
        <div className="absolute bottom-1/3 right-1/3">
          <div className="w-12 h-12 rounded-full bg-white/60" />
          <div className="absolute inset-1 w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FFC0CB 100%)' }} />
        </div>
        <div className="absolute top-1/2 left-1/4">
          <div className="w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E91E63 100%)' }} />
          <div className="absolute inset-1 w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #FFC0CB 0%, #FFFFFF 100%)' }} />
        </div>
        {/* Large blur shapes */}
        <div className="absolute top-10 right-1/4 w-52 h-52 bg-pink-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-pink-500" />
            <span className="text-pink-600 font-heading text-lg">@yumbymaryam</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-heading mb-4">
            <span className="gradient-text">Follow Our Sweet Journey</span>
          </h2>
          <p className="text-gray-600 text-lg font-body max-w-2xl mx-auto">
            Get inspired by our latest creations and behind-the-scenes moments
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Video Side */}
          <div ref={videoRef} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-square object-cover"
              >
                <source src="/videos/2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent pointer-events-none" />
            </div>

            {/* Instagram Badge */}
            <a 
              href="https://instagram.com/yumbymaryam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-xl border border-pink-100 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="font-heading text-gray-700">Follow Us</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>

          {/* Instagram Grid - Using Instagram Embeds */}
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={`https://instagram.com/p/${post.shortcode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg border border-pink-100 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                {/* Instagram Post Thumbnail via embed URL */}
                <iframe
                  src={`https://www.instagram.com/p/${post.shortcode}/embed`}
                  className="w-full h-full border-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  title={`Instagram post ${post.id}`}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <Instagram className="w-6 h-6" />
                    <span className="font-medium">View on Instagram</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Extended background to footer - no white gap */}
      <div className="h-24 bg-gradient-to-b from-transparent to-pink-50 mt-16" />
    </section>
  );
}
