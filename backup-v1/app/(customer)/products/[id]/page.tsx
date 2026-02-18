import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Star, Package, Truck, ShieldCheck } from 'lucide-react'
import AddToCartButton from '@/components/product/AddToCartButton' // We'll create this client component

export const dynamic = 'force-dynamic'

interface ProductPageProps {
    params: {
        id: string
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            category: true,
            inventory: true,
            images: {
                orderBy: { order: 'asc' }
            }
        }
    })

    if (!product) {
        notFound()
    }

    const currentStock = product.inventory[0]?.currentStock || 0
    const isOutOfStock = currentStock <= 0

    // Combine primary image with other images for gallery
    // If primaryImage is not in images list, add it to start
    const allImages = []
    if (product.primaryImage) {
        allImages.push({ id: 'primary', url: product.primaryImage, altText: product.name })
    }
    product.images.forEach(img => {
        // Avoid duplicates if primary image is also in the relation
        if (img.url !== product.primaryImage) {
            allImages.push(img)
        }
    })

    // If no images, use placeholder
    if (allImages.length === 0) {
        allImages.push({ id: 'placeholder', url: null, altText: product.name })
    }

    // Serialize product for UI (convert Decimals to numbers)
    const serializedProduct = {
        ...product,
        retailPrice: product.retailPrice.toNumber(),
        basePrice: product.basePrice.toNumber(),
        wholesalePrice: product.wholesalePrice?.toNumber(),
        exportPrice: product.exportPrice?.toNumber(),
        weight: product.weight?.toNumber(),
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb / Back */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link
                    href="/products"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">

                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                            {allImages[0].url ? (
                                <Image
                                    src={allImages[0].url}
                                    alt={allImages[0].altText || serializedProduct.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Package className="w-24 h-24 text-gray-300" />
                                </div>
                            )}

                            {serializedProduct.isOrganic && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                    Organic
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip (if multiple images) */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {allImages.map((img) => (
                                    <button
                                        key={img.id}
                                        className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 transition-colors"
                                    >
                                        {img.url && (
                                            <Image
                                                src={img.url}
                                                alt={img.altText || 'Thumbnail'}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{serializedProduct.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <Link href={`/products?category=${serializedProduct.categoryId}`} className="hover:text-green-600 underline decoration-dotted">
                                    {serializedProduct.category.name}
                                </Link>
                                <span>•</span>
                                <span className="font-mono">{serializedProduct.sku}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="sr-only">Product information</h2>
                            <div className="flex items-baseline gap-4">
                                <p className="text-4xl font-bold text-gray-900">₹{serializedProduct.retailPrice}</p>
                                {serializedProduct.basePrice > serializedProduct.retailPrice && (
                                    <p className="text-xl text-gray-500 line-through">₹{serializedProduct.basePrice}</p>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Price per {serializedProduct.unit} (approx. {serializedProduct.weight}kg)
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mt-8">
                            <h3 className="sr-only">Description</h3>
                            <div
                                className="prose prose-sm text-gray-700 max-w-none"
                                dangerouslySetInnerHTML={{ __html: serializedProduct.descriptionEn || serializedProduct.shortDescEn || 'No description available.' }}
                            />
                        </div>

                        {/* Guarantee/Benefits */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-200 py-6">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-600">Fast Delivery Available</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-600">Quality Guaranteed</span>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="mt-8">
                            <AddToCartButton
                                product={{
                                    id: serializedProduct.id,
                                    name: serializedProduct.name,
                                    retailPrice: serializedProduct.retailPrice
                                }}
                                currentStock={currentStock}
                            />
                        </div>

                        {/* Meta / Additional Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Availability:</span>
                                <span className={isOutOfStock ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                </span>
                            </div>
                            {serializedProduct.isExportGrade && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Grade:</span>
                                    <span className="text-gray-900">Export Quality</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
