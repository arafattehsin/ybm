'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline();
      
      // Overlay slides away
      tl.fromTo(overlayRef.current,
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 0.6, ease: 'power3.inOut' }
      );
      
      // Content fades in
      tl.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-gradient-to-br from-pink-400 via-pink-300 to-pink-200 pointer-events-none"
        style={{ transformOrigin: 'top' }}
      />
      
      {/* Page Content */}
      <div ref={containerRef}>
        {children}
      </div>
    </>
  );
}

