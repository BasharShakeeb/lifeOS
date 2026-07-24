import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const token = request.cookies.get('lifeos_token')?.value;

  // Auth gating is prepared for backend integration.
  // Once authentication is connected, protected routes will redirect
  // unauthenticated visitors to the login page.
  if (isProtectedRoute && token === '__never__') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
