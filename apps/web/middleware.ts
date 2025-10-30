import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CORS allowlist via env: comma-separated origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isApi = req.nextUrl.pathname.startsWith('/api/');

  if (!isApi) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const allow = allowedOrigins.length === 0 || allowedOrigins.includes(origin) ? origin : '';

  if (allow) {
    res.headers.set('Access-Control-Allow-Origin', allow);
    res.headers.set('Vary', 'Origin');
  }

  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature');
  res.headers.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};


