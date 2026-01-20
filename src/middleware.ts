import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/auth/*
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/auth')) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/auth/login', request.url));
    }

    // Token verification will be done in API routes
    // Here we just check if token exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
