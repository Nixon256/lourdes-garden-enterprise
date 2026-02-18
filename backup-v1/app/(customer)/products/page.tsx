import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import { Search } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering since we depend on search params
export const dynamic = 'force-dynamic'

interface ProductsPageProps {
    searchParams: {
        search?: string
        category?: string
        sort?: string
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { search, category, sort } = searchParams

    // Build query
    const where: any = {
        status: 'ACTIVE', // Only show active products
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
        ]
    }

    if (category) {
        where.categoryId = category
    }

    // Get products
    const rawProducts = await prisma.product.findMany({
        where,
        include: {
            category: true,
            inventory: {
                select: {
                    currentStock: true,
                },
            },
        },
        orderBy: sort === 'price_asc'
            ? { retailPrice: 'asc' }
            : sort === 'price_desc'
                ? { retailPrice: 'desc' }
                : { createdAt: 'desc' }, // Default to newest
    })

    // Convert Prisma Decimal to number for the UI and strictly select fields
    const products = rawProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        basePrice: p.basePrice.toNumber(),
        retailPrice: p.retailPrice.toNumber(),
        primaryImage: p.primaryImage,
        isOrganic: p.isOrganic,
        category: {
            name: p.category.name
        },
        inventory: p.inventory.map(i => ({
            currentStock: i.currentStock
        }))
    }))

    // Get categories for filter sidebar
    const categories = await prisma.category.findMany()

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Banner */}
            <div className="bg-green-900 text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Our Products</h1>
                    <p className="mt-2 text-green-100">Fresh from our garden to your home</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar (Simple version for now) */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                <Link
                                    href="/products"
                                    className={`block text-sm ${!category ? 'font-semibold text-green-600' : 'text-gray-600 hover:text-green-600'}`}
                                >
                                    All Categories
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.id}`}
                                        className={`block text-sm ${category === cat.id ? 'font-semibold text-green-600' : 'text-gray-600 hover:text-green-600'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                                <div className="space-y-2">
                                    <Link href="/products?sort=newest" className="block text-sm text-gray-600 hover:text-green-600">Newest Arrivals</Link>
                                    <Link href="/products?sort=price_asc" className="block text-sm text-gray-600 hover:text-green-600">Price: Low to High</Link>
                                    <Link href="/products?sort=price_desc" className="block text-sm text-gray-600 hover:text-green-600">Price: High to Low</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <form className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={search}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </form>
                        </div>

                        {/* Product Grid */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <Link href="/products" className="text-green-600 font-medium mt-2 hover:underline">
                                    Clear all filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
