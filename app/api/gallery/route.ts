import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/gallery — public, returns all gallery images ordered by order asc
export async function GET() {
    try {
        const images = await prisma.galleryImage.findMany({
            orderBy: [{ order: 'asc' }, { uploadedAt: 'desc' }],
        })
        return NextResponse.json({ images })
    } catch (error) {
        console.error('[GALLERY_GET]', error)
        return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
    }
}

// POST /api/gallery — admin only, add a new gallery image
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { url, alt, category, order } = body

        if (!url) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
        }

        // Count existing images to set order
        const count = await prisma.galleryImage.count()

        const image = await prisma.galleryImage.create({
            data: {
                url,
                alt: alt || 'Gallery Image',
                category: category || 'farm',
                order: order ?? count,
            },
        })

        return NextResponse.json({ image }, { status: 201 })
    } catch (error) {
        console.error('[GALLERY_POST]', error)
        return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
    }
}
