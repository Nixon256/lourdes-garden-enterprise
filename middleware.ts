/**
 * @file middleware.ts
 * @description Next.js 16 Edge Middleware
 *
 * ARCHITECTURE: Bifurcated Security Model — Layer 1 (Edge)
 * ─────────────────────────────────────────────────────────
 * Edge layer: cookie-presence gate (fast, no DB, no crypto)
 * Server layer: getServerSession (Prisma + NextAuth — real auth)
 *
 * The previous architecture used verifyJwt at the edge which could not
 * decode NextAuth's default JWT format, causing authenticated users to
 * be redirected back to login. Fixed by using cookie presence as the
 * edge gate and delegating real role checks to the server layer.
 */

import { NextRequest, NextResponse } from 'next/server'

// ─── Route Rules ─────────────────────────────────────────────────────────────

const ADMIN_ROUTES = ['/admin']
const AUTH_ROUTES = ['/customer']
const REDIRECT_IF_AUTHED = ['/login', '/register']

// ─── Security Headers ─────────────────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'strict-dynamic' https://www.googletagmanager.com https://www.clarity.ms https://checkout.razorpay.com https://js.stripe.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://*.gstatic.com https://*.googleapis.com",
            "connect-src 'self' https://ep-damp-pine-ade7ohzh-pooler.c-2.us-east-1.aws.neon.tech https://www.google-analytics.com https://region1.clarity.ms https://*.googleapis.com",
            "frame-src 'self' https://checkout.razorpay.com https://js.stripe.com https://*.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ].join('; ')
    )
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return response
}

// ─── Cookie presence check (edge-safe, no crypto needed) ─────────────────────

function hasSessionCookie(req: NextRequest): boolean {
    // NextAuth sets one of these depending on HTTP vs HTTPS
    return !!(
        req.cookies.get('next-auth.session-token')?.value ||
        req.cookies.get('__Secure-next-auth.session-token')?.value
    )
}

// ─── Edge Proxy Handler ───────────────────────────────────────────────────────

export default async function proxy(req: NextRequest): Promise<NextResponse> {
    const { pathname } = req.nextUrl

    // Quick cookie presence check at the edge.
    // Real JWT/role verification happens server-side via getServerSession.
    const hasSession = hasSessionCookie(req)

    // 1. Already logged in + hitting login/register → redirect to dashboard
    if (hasSession && REDIRECT_IF_AUTHED.some((r) => pathname.startsWith(r))) {
        return applySecurityHeaders(NextResponse.redirect(new URL('/admin/dashboard', req.url)))
    }

    // 2. Admin routes — no cookie → send to login
    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
        if (!hasSession) {
            const loginUrl = new URL('/login', req.url)
            loginUrl.searchParams.set('callbackUrl', req.url)
            return applySecurityHeaders(NextResponse.redirect(loginUrl))
        }
    }

    // 3. Customer routes — no cookie → send to login
    if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
        if (!hasSession) {
            const loginUrl = new URL('/login', req.url)
            loginUrl.searchParams.set('callbackUrl', req.url)
            return applySecurityHeaders(NextResponse.redirect(loginUrl))
        }
    }

    // 4. Authorized — forward to server. Server components do the real role check.
    return applySecurityHeaders(NextResponse.next())
}
