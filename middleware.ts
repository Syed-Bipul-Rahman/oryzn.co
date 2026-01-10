import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Basic JWT verification (structure check)
    // Full verification happens in API routes
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token');
      }
    } catch {
      // Invalid token, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // If user is logged in and tries to access login page, redirect to admin
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } catch {
        // Invalid token, let them access login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
