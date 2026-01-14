import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    // Only protect /admin routes
    if (!req.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next()
    }

    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        // DEFAULT CREDENTIALS
        // User: admin
        // Pass: load from env or default to "admin"
        const validUser = 'admin'
        const validPass = process.env.ADMIN_PASSWORD || 'admin'

        if (user === validUser && pwd === validPass) {
            return NextResponse.next()
        }
    }

    return new NextResponse('Auth Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    })
}

export const config = {
    matcher: '/admin/:path*',
}
