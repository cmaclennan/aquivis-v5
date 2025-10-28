import { NextResponse, NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/tasks', '/properties'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // Rely on Supabase auth cookies; if missing, redirect to /login
  const hasAccessToken = req.cookies.has('sb-access-token');
  if (!hasAccessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*', '/properties/:path*']
};

