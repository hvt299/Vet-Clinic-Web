import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    const protectedPaths = [
        '/dashboard',
        '/users',
        '/customers',
        '/pets',
        '/doctors',
        '/inventory',
        '/vaccines',
        '/settings'
    ]

    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/login',
        '/dashboard/:path*',
        '/users/:path*',
        '/customers/:path*',
        '/pets/:path*',
        '/doctors/:path*',
        '/inventory/:path*',
        '/vaccines/:path*',
        '/settings/:path*',
    ],
}