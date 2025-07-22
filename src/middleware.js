import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const esMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Si accede manualmente a /Sesion, eliminar el token
  if (pathname === '/Sesion' && request.method === 'GET') {
    const response = NextResponse.next();
    console.log("📥 Token detectado en /Sesion:", token);

    if (token) {
      try {
        await jwtVerify(token, secret, {
          issuer: 'Sholi',
          audience: 'Sholi',
        });
        console.log('🟢 Token válido, eliminando al acceder manualmente a /Sesion');
        response.cookies.set('jwt', '', { maxAge: 0 });
      } catch (err) {
        console.log('🔴 Token inválido, no se borra nada');
      }
    }

    response.headers.set('x-es-mobile', esMobile ? '1' : '0');
    return response;
  }

  // 🔐 Si no hay token en ruta protegida, redirigir
  if (!token) {
    console.log('🔴 No hay token, redirigiendo a /Sesion');
    return NextResponse.redirect(new URL('/Sesion', request.url));
  }

  try {
    await jwtVerify(token, secret, {
      issuer: 'Sholi',
      audience: 'Sholi',
    });
    return NextResponse.next();
  } catch (err) {
    console.log('🔴 Token inválido (verificación falló):', err.message);
    return NextResponse.redirect(new URL('/Sesion', request.url));
  }
}

export const config = {
  matcher: ['/Sesion', '/Administrador'],
};
