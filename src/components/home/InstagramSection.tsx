'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, ExternalLink } from 'lucide-react';
import type { InstagramMediaItem } from '@/lib/instagram';

gsap.registerPlugin(ScrollTrigger);

interface InstagramSectionProps {
  posts: InstagramMediaItem[];
}

export function InstagramSection({ posts = [] }: InstagramSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-gradient-merged">
      {/* Background Decorative Bakery Shapes - Hidden on mobile */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Croissant shape */}
        <div className="absolute top-40 right-20">
          <svg viewBox="0 0 64 64" className="w-14 h-14 text-pink-300/40" fill="currentColor">
            <path d="M8 40c4-20 16-28 24-28 4 0 10 2 16 8 6 6 8 12 8 16 0 8-8 12-16 8-4-2-8-1-12 2-8 6-22 4-20-6z" />
          </svg>
        </div>
        {/* Cake shape */}
        <div className="absolute bottom-1/3 right-1/3">
          <svg viewBox="0 0 64 64" className="w-10 h-10 text-pink-400/30" fill="currentColor">
            <path d="M8 48l24-40 24 40c0 4-4 8-12 8H20c-8 0-12-4-12-8z" />
          </svg>
        </div>
        {/* Cupcake shape */}
        <div className="absolute top-1/2 left-1/4">
          <svg viewBox="0 0 64 64" className="w-10 h-10 text-pink-200/50" fill="currentColor">
            <path d="M16 28c0-8 6-14 16-14s16 6 16 14c0 2-1 4-2 5h-28c-1-1-2-3-2-5z" />
            <path d="M14 35h36c1 0 2 1 2 2l-4 22c0 2-2 3-4 3H20c-2 0-4-1-4-3l-4-22c0-1 1-2 2-2z" />
          </svg>
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

        {/* Video Box - Centered */}
        <div className="flex justify-center mb-12">
          <div ref={videoRef} className="relative max-w-xl w-full">
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
        </div>

        {/* Instagram Grid - Using Instagram Embeds */}
        <div className="max-w-4xl mx-auto">
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.slice(0, 6).map((post) => {
              const imageSrc = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
              
              if (!imageSrc) return null;

              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg border border-pink-100 bg-gradient-to-br from-pink-100 to-pink-50 hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src={imageSrc}
                    alt={post.caption || 'Instagram post'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <Instagram className="w-6 h-6" />
                      <span className="font-medium">View on Instagram</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
