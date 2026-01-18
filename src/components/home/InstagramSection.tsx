'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Sample Instagram posts data - in production, fetch from Instagram API
const instagramPosts = [
  { id: 1, image: '/images/products/Ferrero-Rocher-Cake.jpg', likes: 245, comments: 18 },
  { id: 2, image: '/images/products/Nutella-Cupcakes.jpg', likes: 312, comments: 24 },
  { id: 3, image: '/images/products/Tres-Leches-Cake.jpg', likes: 189, comments: 12 },
  { id: 4, image: '/images/products/Cookies-and-Cream-Cupcakes.jpg', likes: 276, comments: 21 },
  { id: 5, image: '/images/products/Biscoff-Cake.jpg', likes: 198, comments: 15 },
  { id: 6, image: '/images/products/Lotus-Biscoff-Cupcakes.jpg', likes: 234, comments: 19 },
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
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-20, 20)`,
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
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-white via-pink-50 to-pink-100">
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-pink-100/40 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/50 rounded-full blur-xl" />
        {/* Instagram icons floating */}
        <Instagram className="absolute top-1/4 right-1/3 w-8 h-8 text-pink-200/40" />
        <Heart className="absolute bottom-1/3 left-1/4 w-6 h-6 text-pink-300/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-14">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-full shadow-lg mb-6">
            <Instagram className="w-5 h-5" />
            <span className="font-semibold">@yumbymaryam</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">
            <span className="gradient-text">Follow Us</span>
            <span className="text-gray-800"> on Instagram</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our sweet community for daily inspiration, behind-the-scenes peeks, and mouth-watering creations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div ref={videoRef} className="lg:col-span-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full min-h-[400px]">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 blur-xl opacity-30 transform scale-105" />
              
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/2.mp4" type="video/mp4" />
              </video>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="w-6 h-6" />
                  <span className="font-semibold">@yumbymaryam</span>
                </div>
                <p className="text-sm text-white/80">Watch our latest creations come to life ✨</p>
              </div>
            </div>
          </div>

          {/* Instagram Grid */}
          <div ref={gridRef} className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/yumbymaryam/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={post.image}
                  alt="Instagram post"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/90 via-pink-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5 fill-white" />
                        <span className="font-semibold">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-semibold">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/yumbymaryam/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group"
          >
            <Instagram className="w-6 h-6" />
            Follow @yumbymaryam
            <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
