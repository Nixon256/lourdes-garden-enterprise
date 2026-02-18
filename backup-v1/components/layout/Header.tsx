'use client'

import Link from 'next/link'
import { Leaf, ShoppingBag } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useEffect, useState } from 'react'

import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { useLanguageStore } from '@/lib/store/useLanguageStore'

export default function Header() {
    const { data: session } = useSession()
    const { toggleCart, totalItems } = useCartStore()
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            story: 'Our Story',
            products: 'Products',
            title: 'Lourdes Garden',
            subtitle: 'Premium Organic Products',
        },
        ta: {
            story: 'எங்கள் கதை',
            products: 'தயாரிப்புகள்',
            title: 'லூர்து கார்டன்',
            subtitle: 'சிறந்த இயற்கை தயாரிப்புகள்',
        }
    }

    const content = isMounted ? t[language] : t.en

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="w-8 h-8 text-green-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white arima-font">{content.title}</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{content.subtitle}</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 font-medium transition">
                                {content.story}
                            </Link>
                            <Link href="/#products" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 font-medium transition">
                                {content.products}
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <LanguageToggle />
                        <ThemeToggle />

                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {isMounted && totalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalItems()}
                                </span>
                            )}
                        </button>

                        {!isMounted || status === 'loading' ? (
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                                    Hi, <span className="font-semibold">{session.user?.name}</span>
                                </span>
                                <button
                                    onClick={async () => {
                                        await signOut({ redirect: false, callbackUrl: '/login' });
                                        window.location.href = '/login';
                                    }}
                                    data-testid="logout-button"
                                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
                                >
                                    Logout
                                </button>
                                {(session.user?.role === 'SUPER_ADMIN' || session.user?.role === 'ADMIN') && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
