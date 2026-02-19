import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public paths
    const publicPaths = ['/login', '/api/auth/login', '/api/auth/register'];
    if (publicPaths.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Static assets
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check auth
    const token = req.cookies.get('auth_token')?.value;
    if (!token && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
