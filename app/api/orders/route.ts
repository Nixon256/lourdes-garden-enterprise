
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const body = await req.json()
        const { items, shippingDetails, total } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
        }

        // 1. Handle User (Auth or Guest)
        let userId = session?.user?.id

        if (!userId) {
            // Check if user exists by email
            const existingUser = await prisma.user.findUnique({
                where: { email: shippingDetails.email },
            })

            if (existingUser) {
                userId = existingUser.id
            } else {
                // Create Guest User
                const newUser = await prisma.user.create({
                    data: {
                        email: shippingDetails.email,
                        name: shippingDetails.fullName,
                        phone: shippingDetails.phone,
                        role: 'CUSTOMER',
                        status: 'ACTIVE', // Auto-activate guest for now
                    },
                })
                userId = newUser.id
            }
        }

        // 2. Create Shipping Address
        const address = await prisma.address.create({
            data: {
                userId: userId!,
                fullName: shippingDetails.fullName,
                email: shippingDetails.email,
                phone: shippingDetails.phone,
                addressLine1: shippingDetails.addressLine1,
                city: shippingDetails.city,
                state: shippingDetails.state,
                postalCode: shippingDetails.postalCode,
                country: 'India',
                type: 'SHIPPING',
            },
        })

        // 3. Prepare Order Items
        const orderItemsData = []

        for (const item of items) {
            // Find product by slug (since our cart might use demo IDs)
            const product = await prisma.product.findUnique({
                where: { slug: item.slug }
            })

            if (product) {
                orderItemsData.push({
                    productId: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                })
            } else {
                // Fallback for purely demo items that might not exist in DB yet
                // In a strict system we'd error, but for demo continuity:
                // matching the "demo" items from page.tsx to the seeded data:
                // 'organic-black-pepper' -> exists
                // 'mountain-banana' -> exists
                // 'fresh-mountain-lemons' -> exists
                // 'premium-avocado' -> exists
                // So they SHOULD all be found.
                console.warn(`Product not found for slug: ${item.slug}`)
            }
        }

        if (orderItemsData.length === 0) {
            return NextResponse.json({ error: 'No valid products found' }, { status: 400 })
        }

        // 4. Create Order
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: userId!,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                paymentMethod: 'COD',
                subtotal: total,
                total: total,
                shippingAddressId: address.id,
                billingAddressId: address.id,
                items: {
                    create: orderItemsData
                },
            },
        })


        return NextResponse.json({ success: true, orderId: order.id })

    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
