'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus, ShoppingCart, Package } from 'lucide-react'

interface Product {
    id: string
    name: string
    slug?: string
    retailPrice: number
    basePrice: number
    primaryImage: string | null
    category: {
        name: string
    }
    isOrganic: boolean
    inventory: {
        currentStock: number
    }[]
}

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = (product.inventory[0]?.currentStock || 0) <= 0

    return (
        <Link
            href={`/products/${product.id}`}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {product.primaryImage ? (
                    <Image
                        src={product.primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isOrganic && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                            Organic
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                            Out of Stock
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{product.category.name}</div>
                <h3 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-green-600 transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">₹{product.retailPrice}</span>
                        {product.basePrice > product.retailPrice && (
                            <span className="text-xs text-gray-500 line-through">₹{product.basePrice}</span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault() // Prevent navigation when clicking button
                            // TODO: Add to cart logic
                        }}
                        disabled={isOutOfStock}
                        className="p-2 bg-gray-100 text-gray-900 rounded-full hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-900 transition-colors"
                        title="Add to Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Link>
    )
}
