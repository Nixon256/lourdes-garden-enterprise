'use client'

import React, { useEffect, useState } from 'react'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { Languages } from 'lucide-react'

export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguageStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-20 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        )
    }

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 transition-all border border-transparent hover:border-green-200 dark:hover:border-green-800"
            aria-label="Toggle language"
        >
            <Languages className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span className="text-sm font-bold tracking-tight">
                {language === 'en' ? 'ENGLISH' : 'தமிழ்'}
            </span>
        </button>
    )
}
