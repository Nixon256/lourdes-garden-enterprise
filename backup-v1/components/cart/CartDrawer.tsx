'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/useCartStore'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/lib/store/useLanguageStore'

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        totalPrice
    } = useCartStore()
    const { language } = useLanguageStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        useCartStore.persist.rehydrate() // Keep rehydrate for cart store
    }, [])

    const t = {
        en: {
            title: 'Shopping Cart',
            empty: 'Cart is empty',
            emptyDesc: 'Start adding some premium products.',
            continue: 'Continue Shopping',
            subtotal: 'Subtotal',
            checkout: 'Checkout',
            shipping: 'Shipping and taxes calculated at checkout.',
            or: 'or',
            remove: 'Remove',
            perUnit: 'per unit',
        },
        ta: {
            title: 'கூடை (Cart)',
            empty: 'கூடை காலியாக உள்ளது',
            emptyDesc: 'சிறந்த தயாரிப்புகளைச் சேர்க்கத் தொடங்குங்கள்.',
            continue: 'தொடர்ந்து ஷாப்பிங் செய்யுங்கள்',
            subtotal: 'மொத்தம்',
            checkout: 'வெளியேறு (Checkout)',
            shipping: 'ஷிப்பிங் மற்றும் வரிகள் செக்அவுட்டில் கணக்கிடப்படும்.',
            or: 'அல்லது',
            remove: 'நீக்கு',
            perUnit: 'ஒரு யூனிட்டிற்கு',
        }
    }

    const content = mounted ? t[language] : t.en

    if (!mounted) return null

    const handleCheckout = () => {
        closeCart()
        router.push('/checkout')
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 arima-font" onClose={closeCart}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-950 shadow-xl transition-colors duration-300">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {content.title}
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition"
                                                        onClick={closeCart}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    {items.length === 0 ? (
                                                        <div className="text-center py-12">
                                                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700" />
                                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{content.empty}</h3>
                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                {content.emptyDesc}
                                                            </p>
                                                            <div className="mt-6">
                                                                <button
                                                                    type="button"
                                                                    onClick={closeCart}
                                                                    className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                                                >
                                                                    {content.continue}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-800">
                                                            {items.map((item) => (
                                                                <li key={item.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 relative">
                                                                        {item.image ? (
                                                                            <Image
                                                                                src={item.image}
                                                                                alt={item.name}
                                                                                fill
                                                                                className="h-full w-full object-cover object-center"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-full w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                                                                <ShoppingBag className="h-8 w-8 text-gray-300 dark:text-gray-700" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                                                <h3>
                                                                                    <Link href={`/product/${item.slug}`} onClick={closeCart}>
                                                                                        {language === 'ta' && item.name === 'Organic Black Pepper' ? 'ஆர்கானிக் மிளகு' :
                                                                                            language === 'ta' && item.name === 'Mountain Banana' ? 'மலை வாழைப்பழம்' :
                                                                                                language === 'ta' && item.name === 'Fresh Lemons' ? 'புதிய எலுமிச்சை' :
                                                                                                    language === 'ta' && item.name === 'Premium Avocado' ? 'பிரீமியம் வெண்ணெய் பழம்' :
                                                                                                        item.name}
                                                                                    </Link>
                                                                                </h3>
                                                                                <p className="ml-4">₹{item.price * item.quantity}</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">₹{item.price} {content.perUnit}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                                                                                <button
                                                                                    type="button"
                                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-md transition"
                                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                                >
                                                                                    <Minus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                                                </button>
                                                                                <span className="px-3 py-1 text-gray-900 dark:text-white">{item.quantity}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-md transition"
                                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                                >
                                                                                    <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                                                </button>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeItem(item.id)}
                                                                                className="font-medium text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                                <span className="hidden sm:inline">{content.remove}</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {items.length > 0 && (
                                            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-6 sm:px-6 transition-colors">
                                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                    <p>{content.subtotal}</p>
                                                    <p>₹{totalPrice()}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                                    {content.shipping}
                                                </p>
                                                <div className="mt-6">
                                                    <button
                                                        onClick={handleCheckout}
                                                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 transition"
                                                    >
                                                        {content.checkout}
                                                    </button>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                                                    <p>
                                                        {content.or}{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-green-600 dark:text-green-500 hover:text-green-500 dark:hover:text-green-400"
                                                            onClick={closeCart}
                                                        >
                                                            {content.continue}
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
