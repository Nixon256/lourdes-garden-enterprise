/**
 * @file lib/auth/getServerSession.ts
 * @description DB-level session resolver for Server Components.
 *
 * USAGE ZONE: Server Components / Server Actions ONLY
 * LAYER:       Deep authorization (DB-verified role + status)
 *
 * Architecture:
 *   - proxy.ts verifies JWT signature (edge, no DB) ──► passes x-user-id header
 *   - This file reads x-user-id header and fetches full User from Neon DB via Prisma
 *   - Wrapped in React.cache() for deduplication across a single RSC render tree
 *
 * This implements the "Bifurcated Security Model":
 *   Edge Layer:  cryptographic trust (fast, stateless)
 *   Server Layer: database truth (authoritative, with Prisma)
 *
 * CVE-2025-55184 mitigation: cache() is scoped per-request, preventing
 * cross-request cache poisoning in React Server Component payloads.
 */

import { cache } from 'react'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export interface ServerSession {
    userId: string
    email: string
    name: string
    role: 'CUSTOMER' | 'WHOLESALER' | 'DISTRIBUTOR' | 'ADMIN' | 'SUPER_ADMIN'
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'
    image: string | null
}

/**
 * Retrieves the authenticated server session by reading the x-user-id header
 * set by proxy.ts, then performing a DB lookup to verify current role and status.
 *
 * React.cache() ensures this DB query fires AT MOST ONCE per RSC render tree,
 * regardless of how many components call getServerSession() in the same request.
 *
 * PPR Note: This function causes a dynamic boundary — components using it
 * must be wrapped in <Suspense> to enable Partial Pre-Rendering.
 */
export const getServerSession = cache(async (): Promise<ServerSession | null> => {
    // 1. Read the user-id forwarded by proxy.ts from the edge JWT check
    const headersList = await headers()
    const userId = headersList.get('x-user-id')
    const proxyRole = headersList.get('x-user-role')

    // If proxy.ts didn't set x-user-id, the request was unauthenticated at the edge
    if (!userId || !proxyRole) {
        return null
    }

    // 2. Database-level verification: fetch current status and role from Neon
    //    This is the authoritative source of truth — not the JWT alone.
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            image: true,
        },
    })

    // User deleted or suspended since JWT was issued
    if (!user || user.status !== 'ACTIVE') {
        return null
    }

    return {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as ServerSession['role'],
        status: user.status as ServerSession['status'],
        image: user.image,
    }
})
