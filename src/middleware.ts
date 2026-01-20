import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /getmein routes except /getmein/auth/*
  if (pathname.startsWith('/getmein') && !pathname.startsWith('/getmein/auth')) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/getmein/auth/login', request.url));
    }

    // Token verification will be done in API routes
    // Here we just check if token exists
  }

  // Create response
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS for HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // CSP (Content Security Policy)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.instagram.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https: data: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.stripe.com https://graph.instagram.com https://*.azurewebsites.net https://*.documents.azure.com;
    frame-src 'self' https://js.stripe.com https://www.instagram.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    '/getmein/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


