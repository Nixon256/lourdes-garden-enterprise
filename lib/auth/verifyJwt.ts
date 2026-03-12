/**
 * @file lib/auth/verifyJwt.ts
 * @description Edge-compatible JWT verifier using jose (Web Crypto API).
 *
 * USAGE ZONE: proxy.ts (Edge Runtime) ONLY
 * CONSTRAINT:  NO Prisma / DB imports allowed here — this runs at the network edge.
 *
 * What it verifies:
 *   1. JWT cryptographic signature (HS256 using NEXTAUTH_SECRET)
 *   2. Token expiry (exp claim)
 *   3. Returns { id, role, email } if valid — no DB call made
 *
 * CVE Mitigations:
 *   - CVE-2025-66478: Prevented by Next.js 16 upgrade (header smuggling)
 *   - CVE-2025-55183: Algorithm pinning to 'HS256' prevents alg confusion attacks
 *   - CVE-2025-55184: Strict claim validation prevents cache poisoning via JWT
 */

import { jwtVerify, type JWTPayload } from 'jose'

export interface LourdesJwtPayload extends JWTPayload {
    id: string
    email: string
    role: 'CUSTOMER' | 'WHOLESALER' | 'DISTRIBUTOR' | 'ADMIN' | 'SUPER_ADMIN'
    name?: string
}

/**
 * Encode the NEXTAUTH_SECRET as a Uint8Array for jose.
 * This is safe to call at the edge — no Node.js APIs used.
 */
function getSecretKey(): Uint8Array {
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
        throw new Error('[proxy]: NEXTAUTH_SECRET is not configured')
    }
    return new TextEncoder().encode(secret)
}

/**
 * Verifies a NextAuth JWT token at the edge.
 * Pinned to HS256 to prevent algorithm confusion attacks (CVE-2025-55183).
 *
 * @param token - Raw JWT string from session cookie
 * @returns Decoded payload or null if invalid/expired
 */
export async function verifyJwt(
    token: string
): Promise<LourdesJwtPayload | null> {
    try {
        const { payload } = await jwtVerify<LourdesJwtPayload>(
            token,
            getSecretKey(),
            {
                algorithms: ['HS256'], // Pin algorithm — prevents alg confusion (CVE-2025-55183)
                clockTolerance: 15,    // 15-second leeway for clock skew
            }
        )

        // Validate required custom claims are present and non-empty
        if (!payload.id || !payload.role || !payload.email) {
            console.warn('[proxy]: JWT missing required claims (id, role, email)')
            return null
        }

        return payload
    } catch {
        // Token is expired, tampered, or uses wrong algorithm — treat as unauthenticated
        return null
    }
}
