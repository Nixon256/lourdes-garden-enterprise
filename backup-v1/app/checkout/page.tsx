'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import AddressForm from '@/components/checkout/AddressForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import { useCartStore } from '@/lib/store/useCartStore'
import Header from '@/components/layout/Header'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    })

    // Redirect if cart is empty
    useEffect(() => {
        // Small timeout to allow hydration
        const timer = setTimeout(() => {
            if (items.length === 0) {
                router.push('/')
                toast.error('Your cart is empty')
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [items, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingDetails: formData,
                    total: totalPrice(),
                }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('Order placed successfully!')
                router.push(`/checkout/success/${data.orderId}`)
            } else {
                toast.error(data.error || 'Failed to place order')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) return null

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <AddressForm formData={formData} setFormData={setFormData} />
                    </div>

                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <OrderSummary loading={loading} />
                    </div>
                </form>
            </main>
        </div>
    )
}
