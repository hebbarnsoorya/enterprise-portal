import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16+ Proxy Entry Point
 * Using 'export default' ensures the framework identifies the entry function 
 * regardless of the filename.
 */
export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Requirement #7: Public vs Private logic
  const publicRoutes = ['/login', '/public-info', '/_next', '/static'];
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  // 1. If no token and not a public route -> Redirect to login
  if (!token && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If token exists and user hits login -> Redirect to dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher configuration remains as a named export
 */
export const config = {
  matcher: [
    /*
     * Intercept all routes except internal assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};