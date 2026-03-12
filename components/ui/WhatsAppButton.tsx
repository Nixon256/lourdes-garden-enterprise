'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { trackWhatsAppClick } from '@/lib/analytics'
import { useLanguageStore } from '@/lib/store/useLanguageStore'

const WHATSAPP_NUMBER = '917373348242'

export default function WhatsAppButton() {
    const { language } = useLanguageStore()
    const [isVisible, setIsVisible] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    const t = {
        en: {
            tooltip: 'Need help? Chat with us on WhatsApp! 💬',
            message: "Hi! I'm interested in your organic products from Lourdes Garden. Can you help me?",
            aria: "Chat on WhatsApp"
        },
        ta: {
            tooltip: 'உதவி வேண்டுமா? வாட்ஸ்அப்பில் எங்களைத் தொடர்பு கொள்ளுங்கள்! 💬',
            message: "வணக்கம்! லூர்து கார்டனின் ஆர்கானிக் தயாரிப்புகளில் எனக்கு ஆர்வம் உள்ளது. எனக்கு உதவ முடியுமா?",
            aria: "வாட்ஸ்அப்பில் அரட்டையடிக்கவும்"
        }
    }

    const content = t[language as keyof typeof t] || t.en

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000)
        const tooltipTimer = setTimeout(() => setShowTooltip(true), 5000)
        return () => {
            clearTimeout(timer)
            clearTimeout(tooltipTimer)
        }
    }, [])

    const handleClick = () => {
        trackWhatsAppClick('floating_button')
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(content.message)}`
        window.open(url, '_blank')
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
            {/* Tooltip */}
            {showTooltip && (
                <div
                    className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-[200px] animate-fade-in"
                    data-testid="whatsapp-tooltip"
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowTooltip(false) }}
                        className="absolute -top-3 -right-3 w-7 h-7 bg-gray-500 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all z-10"
                        data-testid="whatsapp-tooltip-close"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-sm font-medium">{content.tooltip}</p>
                    <div className="absolute right-4 -bottom-2 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 transform rotate-45" />
                </div>
            )}

            {/* WhatsApp Button */}
            <button
                onClick={handleClick}
                className="group relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce-slow"
                aria-label={content.aria}
                data-testid="whatsapp-floating-button"
            >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />

                {/* WhatsApp SVG Icon */}
                <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-white fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </button>
        </div>
    )
}
