'use client'

import { useCartStore } from '@/lib/store/useCartStore'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface OrderSummaryProps {
    loading: boolean
}

export default function OrderSummary({ loading }: OrderSummaryProps) {
    const { items, totalPrice } = useCartStore()

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24 transition-colors">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

            <div className="flow-root mb-6">
                <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-gray-800">
                    {items.map((item) => (
                        <li key={item.id} className="flex py-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 relative">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
                                        🌿
                                    </div>
                                )}
                            </div>

                            <div className="ml-4 flex flex-1 flex-col text-gray-900 dark:text-white">
                                <div>
                                    <div className="flex justify-between text-base font-medium">
                                        <h3>{item.name}</h3>
                                        <p className="ml-4">₹{item.price * item.quantity}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty {item.quantity}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <p>Subtotal</p>
                    <p>₹{totalPrice()}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex justify-between text-base font-medium text-gray-900 dark:text-white">
                    <p>Total</p>
                    <p>₹{totalPrice()}</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || items.length === 0}
                className="mt-6 w-full flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                    </>
                ) : (
                    'Place Order'
                )}
            </button>
        </div>
    )
}
