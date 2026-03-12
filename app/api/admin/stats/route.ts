import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const [productCount, galleryCount, latestProduct] = await Promise.all([
            prisma.product.count(),
            prisma.galleryImage.count(),
            prisma.product.findFirst({
                orderBy: { updatedAt: 'desc' },
                select: { name: true, updatedAt: true }
            })
        ])

        return NextResponse.json({
            totalProducts: productCount,
            totalGallery: galleryCount,
            latestProduct: latestProduct?.name || 'None',
            lastUpdated: latestProduct?.updatedAt
        })
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
