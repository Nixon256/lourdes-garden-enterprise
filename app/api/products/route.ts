import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductStatus, ProductType } from '@prisma/client'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId')
        const status = searchParams.get('status')
        const isFeatured = searchParams.get('isFeatured') === 'true'
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const where = {
            ...(categoryId && { categoryId }),
            ...(status && { status: status as ProductStatus }),
            ...(isFeatured && { isFeatured }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as any } },
                    { sku: { contains: search, mode: 'insensitive' as any } },
                ],
            }),
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    inventory: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('[PRODUCTS_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function POST(req: Request) {
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
            initialStock = 0,
        } = body

        if (!name || !sku || !slug || !categoryId || !basePrice || !retailPrice) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const product = await prisma.product.create({
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
                inventory: {
                    create: {
                        currentStock: initialStock,
                        availableStock: initialStock,
                        warehouse: 'Main Warehouse',
                    }
                }
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('[PRODUCTS_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
