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

  return NextResponse.next();
}

export const config = {
  matcher: '/getmein/:path*',
};

