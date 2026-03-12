import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/gallery/[id] — update alt, category, order
export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await props.params
        const body = await req.json()
        const { alt, category, order } = body

        const image = await prisma.galleryImage.update({
            where: { id },
            data: {
                ...(alt !== undefined && { alt }),
                ...(category !== undefined && { category }),
                ...(order !== undefined && { order }),
            },
        })

        return NextResponse.json({ image })
    } catch (error) {
        console.error('[GALLERY_PATCH]', error)
        return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
    }
}

// DELETE /api/gallery/[id] — remove a gallery image record
export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await props.params
        await prisma.galleryImage.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[GALLERY_DELETE]', error)
        return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
    }
}
