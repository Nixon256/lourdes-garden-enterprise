/**
 * @file lib/auth/requireRole.ts
 * @description Server Component role-guard utility.
 *
 * USAGE ZONE: Server Components / Server Actions ONLY
 *
 * Usage in admin layouts:
 *   const session = await requireRole(['ADMIN', 'SUPER_ADMIN'])
 *   // If user is unauthorized, this function redirects automatically
 *   // Otherwise returns the verified ServerSession
 *
 * Architecture note:
 *   This calls getServerSession() (which uses React.cache), meaning
 *   the DB query is deduplicated even if requireRole is called from
 *   multiple components in the same RSC render tree.
 */

import { redirect } from 'next/navigation'
import { getServerSession, type ServerSession } from './getServerSession'

type AllowedRole = 'CUSTOMER' | 'WHOLESALER' | 'DISTRIBUTOR' | 'ADMIN' | 'SUPER_ADMIN'

/**
 * Enforces role-based access control inside Server Components.
 *
 * @param allowedRoles - Array of roles permitted to access the route
 * @param redirectTo   - Where to redirect on failure (default: '/login')
 * @returns            - Verified ServerSession if authorized
 */
export async function requireRole(
    allowedRoles: AllowedRole[],
    redirectTo: string = '/login'
): Promise<ServerSession> {
    const session = await getServerSession()

    // Case 1: No valid session — redirect to login
    if (!session) {
        redirect(redirectTo)
    }

    // Case 2: Authenticated but wrong role — redirect to home (not 403 to avoid info leak)
    if (!allowedRoles.includes(session.role)) {
        redirect('/')
    }

    return session
}

/**
 * Convenience: require any authenticated user (any role)
 */
export async function requireAuth(redirectTo: string = '/login'): Promise<ServerSession> {
    const session = await getServerSession()
    if (!session) {
        redirect(redirectTo)
    }
    return session
}
