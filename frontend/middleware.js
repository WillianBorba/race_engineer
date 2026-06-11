import { NextResponse } from 'next/server';

const PROTECTED = ['/chat'];
const PUBLIC_ONLY = ['/login'];

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (PROTECTED.some(p => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (PUBLIC_ONLY.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/chat/:path*'],
};
