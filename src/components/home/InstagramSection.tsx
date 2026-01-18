'use client';

import { useEffect, useRef } from 'react';
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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-gradient-merged pb-0">
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
