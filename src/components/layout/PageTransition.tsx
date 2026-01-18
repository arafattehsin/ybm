'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef(pathname);

  const runTransition = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline();

    // Animate overlay in
    tl.to(overlayRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power3.inOut'
    })
    // Hold briefly
    .to({}, { duration: 0.15 })
    // Animate overlay out
    .to(overlayRef.current, {
      y: '100%',
      duration: 0.4,
      ease: 'power3.inOut'
    })
    // Reset overlay position
    .set(overlayRef.current, { y: '-100%' });

    // Animate content
    gsap.fromTo(contentRef.current,
      { opacity: 0.8, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    // Only run transition when pathname actually changes (not on initial mount)
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      runTransition();
    }
  }, [pathname, runTransition]);

  // Initial content animation
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <>
      {/* Transition Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 50%, #FFC0CB 100%)',
          transform: 'translateY(-100%)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-heading gradient-text animate-pulse">
            YUM by Maryam
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div ref={contentRef}>
        {children}
      </div>
    </>
  );
}
