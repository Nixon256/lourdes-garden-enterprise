import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductStatus, ProductType } from '@prisma/client'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!params.id) {
            return new NextResponse('Product ID is required', { status: 400 })
        }

        const product = await prisma.product.findUnique({
            where: {
                id: params.id,
            },
            include: {
                category: true,
                inventory: true,
            },
        })

        return NextResponse.json({ product })
    } catch (error) {
        console.error('[PRODUCT_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    return PATCH(req, { params })
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const {
            name,
            sku,
            slug,
            type,
            categoryId,
            descriptionEn,
            descriptionTa,
            shortDescEn,
            shortDescTa,
            basePrice,
            retailPrice,
            wholesalePrice,
            exportPrice,
            unit,
            weight,
            primaryImage,
            isOrganic,
            isExportGrade,
            isFeatured,
            status,
        } = body

        if (!params.id) {
            return new NextResponse('Product ID is required', { status: 400 })
        }

        const product = await prisma.product.update({
            where: {
                id: params.id,
            },
            data: {
                name,
                sku,
                slug,
                type: type as ProductType,
                categoryId,
                descriptionEn,
                descriptionTa,
                shortDescEn,
                shortDescTa,
                basePrice,
                retailPrice,
                wholesalePrice,
                exportPrice,
                unit,
                weight,
                primaryImage,
                isOrganic,
                isExportGrade,
                isFeatured,
                status: status as ProductStatus,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('[PRODUCT_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.id) {
            return new NextResponse('Product ID is required', { status: 400 })
        }

        const product = await prisma.product.delete({
            where: {
                id: params.id,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('[PRODUCT_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
