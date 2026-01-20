'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  text?: string;
}

export function LoadingSpinner({ size = 'md', fullScreen = false, text }: LoadingSpinnerProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const containerSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const logoSizes = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 },
    xl: { width: 100, height: 100 },
  };

  useEffect(() => {
    // Pulse animation for logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    // Dots animation
    if (dotsRef.current) {
      const dots = dotsRef.current.children;
      gsap.to(dots, {
        y: -6,
        duration: 0.5,
        stagger: 0.12,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Spinner Container */}
      <div className={`relative ${containerSizes[size]} flex items-center justify-center`}>
        {/* Rotating ring */}
        <svg 
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: '2s' }}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#spinnerGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="70 200"
          />
        </svg>

        {/* Logo Image */}
        <div ref={logoRef} className="relative z-10">
          <Image
            src="/images/logo.png"
            alt="YBM"
            width={logoSizes[size].width}
            height={logoSizes[size].height}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600 text-sm font-medium">{text}</p>
          <div ref={dotsRef} className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="relative z-10">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

// Simple inline loader for buttons
export function ButtonLoader({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
