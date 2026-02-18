'use client'

import { ShoppingCart } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCartStore } from '@/lib/store/useCartStore'
import { CartItem } from '@/lib/store/useCartStore'

interface AddToCartButtonProps {
    product: {
        id: string
        name: string
        price: number
        image?: string
        slug: string
    }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        const item: CartItem = {
            ...product,
            quantity: 1,
        }

        addItem(item)
        toast.success('Added to cart!')
    }

    return (
        <button
            onClick={handleAddToCart}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
        </button>
    )
}
