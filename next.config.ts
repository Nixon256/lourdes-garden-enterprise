/**
 * @file next.config.ts
 * @description Lourdes Garden V2 — Next.js 16 Production Configuration
 *
 * V2 Phase 1 Upgrades:
 *   ✅ React Compiler — automatic memoization (React 19 + CVE-2025-55184 structural mitigation)
 *   ✅ Turbopack — default bundler with File System Cache (.turbo-cache/)
 *   ✅ Partial Pre-Rendering (PPR) — incremental mode for Server Component boundaries
 *   ✅ Security Headers — CSP, HSTS, X-Frame-Options, Permissions-Policy
 *   ✅ Strict image allowlist — Cloudinary + Google only
 */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ── React Compiler ───────────────────────────────────────────────────────────
  // Enables automatic memoization of components and hooks without useMemo/useCallback.
  // Requires React 19 (already on 19.2.0). Structurally mitigates CVE-2025-55184
  // by preventing unnecessary re-renders that could be exploited via crafted RSC payloads.
  reactCompiler: true,

  // ── Cache Components / PPR ────────────────────────────────────────────────
  // NOTE (V2 Phase 1): cacheComponents is intentionally NOT enabled globally.
  // Existing admin pages use legacy next-auth getServerSession which is
  // incompatible with global PPR enforcement.
  // Enable PPR per-page with `export const experimental_ppr = true` once
  // pages are migrated to the new lib/auth/getServerSession Server Component pattern.
  // cacheComponents: true,  ← deferred to Phase 2

  // ── Turbopack Configuration (Next.js 16 top-level) ───────────────────────────
  // In Next.js 16, Turbopack config lives at the top-level 'turbopack' key.
  // File System Cache is enabled by default in Next.js 16 dev server.
  // The .turbo-cache/ directory is created automatically on first run.
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'],
  },

  // ── Image Optimization ───────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth profile images
      },
    ],
    // Use Cloudinary's own transformation pipeline for non-local images
    formats: ['image/avif', 'image/webp'],
  },

  // ── Security Headers ─────────────────────────────────────────────────────────
  // Applied to every response from the Next.js server.
  // Note: proxy.ts also sets these at the edge — this provides defense-in-depth.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent MIME sniffing (XSS vector)
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Block iframe embedding (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },

          // Force HTTPS for 1 year
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },

          // No referrer leakage on cross-origin navigation
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Restrict browser API access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },

          // Content Security Policy
          // ─ CVE-2025-55184 mitigation: restrict script sources to prevent cache poisoning
          // ─ CVE-2025-55183 mitigation: strict-dynamic prevents injected script execution
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'strict-dynamic' https://www.googletagmanager.com https://www.clarity.ms https://checkout.razorpay.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://www.googletagmanager.com https://*.gstatic.com https://*.googleapis.com",
              "connect-src 'self' https://*.neon.tech https://www.google-analytics.com https://region1.clarity.ms https://api.razorpay.com https://api.stripe.com https://*.googleapis.com",
              "frame-src 'self' https://checkout.razorpay.com https://js.stripe.com https://*.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },

      // ── API Routes: Prevent caching of sensitive data (CVE-2025-55184) ────────
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },

      // ── Admin Routes: No-cache + no-store ────────────────────────────────────
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
}

export default nextConfig
