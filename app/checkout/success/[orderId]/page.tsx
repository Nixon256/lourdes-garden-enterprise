'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/useCartStore'
import Header from '@/components/layout/Header'
import confetti from 'canvas-confetti'

export default function OrderSuccessPage() {
    const params = useParams()
    const { clearCart } = useCartStore()

    useEffect(() => {
        // Clear cart on success
        clearCart()

        // Fire confetti
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
        }, 250)

        return () => clearInterval(interval)
    }, [clearCart])

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Header />

            <main className="flex flex-col items-center justify-center py-20 px-4">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center max-w-md w-full transition-colors">
                    <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for your purchase. We have received your order.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-8 transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
                        <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">{params.orderId}</p>
                    </div>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    )
}
