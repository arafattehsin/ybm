'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Instagram, Send, Clock, CheckCircle, Heart, Sparkles } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video box animation
      gsap.fromTo(videoBoxRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: videoBoxRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(formRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(infoRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
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

      if (floatingRef.current) {
        const floats = floatingRef.current.children;
        Array.from(floats).forEach((float, index) => {
          gsap.to(float, {
            y: `random(-20, 20)`,
            rotation: `random(-10, 10)`,
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F8 30%, #FFEBEF 60%, #FFF0F5 100%)' }}>
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/50 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-pink-300/20 rounded-full blur-xl" />
        {/* Additional decorative shapes */}
        <div className="absolute top-40 right-1/3 w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-40" />
        <div className="absolute bottom-60 left-20 w-8 h-8 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-50" />
      </div>

      {/* Floating Decorations */}
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-20 text-pink-300 opacity-40">
          <Heart size={28} fill="currentColor" />
        </div>
        <div className="absolute bottom-40 left-16 text-pink-200 opacity-50">
          <Sparkles size={32} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-8 text-center">
        <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-pink-600 rounded-full text-sm font-heading font-semibold uppercase tracking-wider mb-6 shadow-sm">
          Get In Touch
        </span>
        <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">
          <span className="gradient-text">Contact</span>
          <span className="text-gray-800"> Us</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 font-body">
          Have a question or want to place a custom order? We&apos;d love to hear from you!
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Video Hero Box - Above Send us a Message */}
        <div ref={videoBoxRef} className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-[2.5rem] blur-2xl opacity-30 transform scale-105" />
            
            {/* Video container */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/60">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-video object-cover"
              >
                <source src="/videos/4.mp4" type="video/mp4" />
              </video>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-pink-900/20 to-transparent" />
              
              {/* Content box overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 md:p-12 mx-4 max-w-lg text-center shadow-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-3">
                    Let&apos;s Create Something <span className="gradient-text">Sweet</span> Together
                  </h2>
                  <p className="text-gray-600 font-body">
                    Whether it&apos;s a custom cake for a special occasion or a simple question, we&apos;re here to help make your moments sweeter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div ref={formRef} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-pink-100">
            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-pink-400 rounded-full"></span>
              Send us a Message
            </h2>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 text-center font-body">Thank you for reaching out. We&apos;ll get back to you soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-heading font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none font-body"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-heading font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-5 py-4 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none font-body"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-heading font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    className="w-full px-5 py-4 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none font-body"
                    placeholder="Custom Order Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-heading font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="w-full px-5 py-4 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none resize-none font-body"
                    placeholder="Tell us about your order or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-gradient py-4 rounded-xl font-heading font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Cards */}
          <div ref={infoRef} className="space-y-6">
            {/* Main Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold font-heading text-gray-900 mb-1">Location</h3>
                <p className="text-gray-600 text-sm font-body">{BUSINESS.location}</p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold font-heading text-gray-900 mb-1">Email</h3>
                <a href={`mailto:${BUSINESS.email}`} className="text-pink-600 text-sm font-body hover:underline">
                  {BUSINESS.email}
                </a>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold font-heading text-gray-900 mb-1">Instagram DM</h3>
                <a 
                  href="https://www.instagram.com/yumbymaryam/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 text-sm font-body hover:underline"
                >
                  @yumbymaryam
                </a>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold font-heading text-gray-900 mb-1">Response Time</h3>
                <p className="text-gray-600 text-sm font-body">Within 24 hours</p>
              </div>
            </div>

            {/* Additional Info Box */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 border border-pink-200">
              <h3 className="font-bold font-heading text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
                Custom Orders Welcome
              </h3>
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                Looking for something special? We love creating custom designs! Share your vision with us and we&apos;ll make it come to life. Perfect for birthdays, weddings, corporate events, and more.
              </p>
            </div>
          </div>
        </div>
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
