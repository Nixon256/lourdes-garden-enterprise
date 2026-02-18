import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAuth = !!token
        const { pathname } = req.nextUrl

        // If already authenticated and trying to access login/register, redirect to dashboard
        if (isAuth && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }

        // Role-based protection for admin area
        if (pathname.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                // Always authorize login and register pages so the middleware function can handle the redirect logic
                if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
                    return true
                }
                // Otherwise, require a token
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        "/admin/:path*",
        "/customer/:path*",
        "/login",
        "/register",
    ],
}
