'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from 'lucide-react'
import { galleryImages } from './gallery-data'

export default function GalleryPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)
    // const [activeCategory, setActiveCategory] = useState('all') // Filters removed
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [isZoomed, setIsZoomed] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            title: 'Our Gallery',
            subtitle: 'A visual journey through the soul of Lourdes Garden',
        },
        ta: {
            title: 'புகைப்படத் தொகுப்பு',
            subtitle: 'லூர்து கார்டனின் ஆன்மா வழியாக ஒரு காட்சி பயணம்',
        }
    }

    const content = isMounted ? t[language] : t.en

    // Filter logic removed - show all
    const filteredImages = galleryImages

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setIsZoomed(false)
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null)
        setIsZoomed(false)
        document.body.style.overflow = 'unset'
    }, [])

    const goNext = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredImages.length : null))
            setIsZoomed(false)
        }
    }, [lightboxIndex, filteredImages.length])

    const goPrev = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null))
            setIsZoomed(false)
        }
    }, [lightboxIndex, filteredImages.length])

    const toggleZoom = () => setIsZoomed(!isZoomed)

    // Handle keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [lightboxIndex, closeLightbox, goNext, goPrev])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-950 dark:via-black dark:to-green-950 transition-colors duration-500 arima-font">
            <Header />

            {/* Hero Section - Parallax Effect & Deep Forest Gradient */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden" data-testid="gallery-hero-section">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero.png" // Fallback high-res hero
                        alt="Gallery Hero"
                        fill
                        className="object-cover opacity-80 scale-105 animate-pulse-slow mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 via-black/40 to-transparent z-10" />
                </div>

                <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
                    <span className="inline-block py-1.5 px-4 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-6 shadow-lg shadow-black/20">
                        Captured Moments
                    </span>
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-white">
                        {content.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-green-50/90 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>
            </section>

            {/* Filters Removed as per request */}
            <div className="h-16"></div>

            {/* Premium Masonry Grid */}
            <section className="max-w-[1920px] mx-auto px-4 pb-20 sm:px-6 lg:px-8">
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                    {filteredImages.map((image, index) => (
                        <div
                            key={image.id}
                            onClick={() => openLightbox(index)}
                            className="break-inside-avoid group relative block w-full rounded-[24px] overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.3)] bg-white dark:bg-gray-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                            style={{ animationDelay: `${index * 100}ms` }} // Staggered reveal
                            data-testid={`gallery-item-${index}`}
                        >
                            <div className="relative w-full overflow-hidden">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Overlay Gradient - Kept for depth but no text */}
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Captions Removed */}

                                {/* Minimal Zoom Icon - Kept for UX */}
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-white hover:text-green-700 text-white shadow-lg">
                                    <Maximize2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && filteredImages[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in backdrop-blur-xl"
                    onClick={closeLightbox}
                    data-testid="gallery-lightbox-modal"
                >
                    {/* Controls Bar */}
                    <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-50 pointer-events-none">
                        {/* Counter Removed/Hidden? User said 'tag or caption'. I'll keep counter or remove? I'll keep it as it's navigation aid. */}
                        <div
                            className="pointer-events-auto px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/90 text-sm font-medium tracking-wider shadow-lg"
                            data-testid="gallery-lightbox-counter"
                        >
                            {lightboxIndex + 1} / {filteredImages.length}
                        </div>

                        {/* Actions */}
                        <div className="pointer-events-auto flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all rounded-full border border-white/10 shadow-lg hover:scale-105 active:scale-95"
                                title="Toggle Zoom"
                            >
                                <ZoomIn className={`w-5 h-5 ${isZoomed ? 'text-green-400' : ''}`} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all rounded-full border border-white/10 shadow-lg hover:scale-105 active:scale-95 group"
                                title="Close"
                                data-testid="gallery-lightbox-close"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={(e) => { e.stopPropagation(); goPrev() }}
                        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white transition-all hover:bg-white/5 rounded-full z-50 hover:scale-110 active:scale-95 backdrop-blur-sm"
                        data-testid="gallery-lightbox-prev"
                    >
                        <ChevronLeft className="w-12 h-12 stroke-[1.5]" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); goNext() }}
                        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white transition-all hover:bg-white/5 rounded-full z-50 hover:scale-110 active:scale-95 backdrop-blur-sm"
                        data-testid="gallery-lightbox-next"
                    >
                        <ChevronRight className="w-12 h-12 stroke-[1.5]" />
                    </button>

                    {/* Image Container */}
                    <div
                        className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                        onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                    >
                        <div className={`relative transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) ${isZoomed ? 'scale-150' : 'scale-100'} w-full h-full p-4 md:p-20 flex items-center justify-center`}>
                            <img
                                src={filteredImages[lightboxIndex].src}
                                alt={filteredImages[lightboxIndex].alt}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                                data-testid="gallery-lightbox-image"
                            />
                        </div>
                    </div>

                    {/* Caption Removed */}
                </div>
            )}

            <Footer />
        </div>
    )
}
