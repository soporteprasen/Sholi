import { NextResponse } from 'next/server';

export async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const esMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  const { pathname } = request.nextUrl;

  // ✅ Si accede manualmente a /Sesion, solo se agrega el header
  if (pathname === '/Sesion' && request.method === 'GET') {
    const response = NextResponse.next();
    response.headers.set('x-es-mobile', esMobile ? '1' : '0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Sesion', '/Administrador'],
};
