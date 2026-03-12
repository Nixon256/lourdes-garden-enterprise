'use client'

import Link from 'next/link'
import { Leaf, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { useLanguageStore } from '@/lib/store/useLanguageStore'

export default function Header() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            story: 'Our Story',
            products: 'Products',
            gallery: 'Gallery',
            contact: 'Contact',
            title: 'Lourdes Garden',
            subtitle: 'Premium Organic Products',
        },
        ta: {
            story: 'எங்கள் கதை',
            products: 'தயாரிப்புகள்',
            gallery: 'கேலரி',
            contact: 'தொடர்பு',
            title: 'லூர்து கார்டன்',
            subtitle: 'சிறந்த இயற்கை தயாரிப்புகள்',
        }
    }

    const content = isMounted ? t[language] : t.en

    const navLinks = [
        { href: '/about', label: content.story },
        { href: '/products', label: content.products },
        { href: '/gallery', label: content.gallery },
        { href: '/contact', label: content.contact },
    ]

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                            data-testid="header-brand-link"
                        >
                            <Leaf className="w-8 h-8 text-green-600 transition-transform group-hover:rotate-12" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white arima-font">{content.title}</h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block uppercase tracking-widest">{content.subtitle}</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 ml-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 font-semibold transition-colors"
                                    data-testid={`header-nav-link-${link.href.replace('/', '')}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            data-testid="header-mobile-menu-button"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                                    data-testid={`header-mobile-nav-link-${link.href.replace('/', '')}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center justify-between px-3 pt-4 border-t border-gray-50 dark:border-gray-800 mt-4 sm:hidden">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Settings</span>
                                <div className="flex items-center gap-4">
                                    <LanguageToggle />
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
