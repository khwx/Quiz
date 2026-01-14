import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // STRICT CHECK: If it's not admin, let it pass immediately
    if (!path.startsWith('/admin')) {
        return NextResponse.next();
    }

    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        // Credenciais
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
    // Update to Array syntax for stricter matching
    matcher: ['/admin', '/admin/:path*'],
}
