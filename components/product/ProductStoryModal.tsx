'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Sprout, Scissors, Star, Package, Leaf, Award } from 'lucide-react'

interface Product {
    id: string
    name: string
    nameTa?: string
    slug: string
    descriptionEn: string
    descriptionTa?: string
    shortDescEn?: string
    shortDescTa?: string
    storyEn?: string
    storyTa?: string
    harvestingSeason?: string
    retailPrice: number
    unit: string
    primaryImage?: string
    isOrganic: boolean
    isExportGrade: boolean
    isFeatured: boolean
    category: {
        id: string
        nameEn: string
        slug: string
        nameTa?: string
    }
}

interface Labels {
    origin: string
    cultivation: string
    harvesting: string
    quality: string
    close: string
    organic: string
    export: string
    productStory: string
    perUnit: string
}

interface ProductStoryModalProps {
    product: Product | null
    language: string
    labels: Labels
    onClose: () => void
}

const storyFacts = (product: Product, labels: Labels) => [
    {
        icon: MapPin,
        label: labels.origin,
        value: 'Lourdes Garden, Oddanchatram, Tamil Nadu',
    },
    {
        icon: Sprout,
        label: labels.cultivation,
        value: product.isOrganic
            ? 'Naturally grown without chemicals or pesticides'
            : 'Traditional cultivation methods',
    },
    {
        icon: Scissors,
        label: labels.harvesting,
        value: product.harvestingSeason
            ? `Hand-picked during ${product.harvestingSeason}`
            : 'Hand-picked from our mountain farms',
    },
    {
        icon: Star,
        label: labels.quality,
        value: product.isExportGrade
            ? 'Premium export-grade organic produce'
            : 'Farm-fresh, naturally cultivated produce',
    },
]

export default function ProductStoryModal({
    product,
    language,
    labels,
    onClose,
}: ProductStoryModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    // ESC key close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (product) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [product, onClose])

    // Click outside to close
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose()
    }

    if (!product) return null

    const name = language === 'ta' && product.nameTa ? product.nameTa : product.name
    const story =
        language === 'ta' && product.storyTa
            ? product.storyTa
            : product.storyEn || product.descriptionEn
    const category =
        language === 'ta' && product.category?.nameTa
            ? product.category.nameTa
            : product.category?.nameEn

    const facts = storyFacts(product, labels)

    return (
        <AnimatePresence>
            {product && (
                <motion.div
                    ref={overlayRef}
                    key="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Product Story: ${name}`}
                >
                    <motion.div
                        key="modal-card"
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FDFCF9] dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 shadow-lg transition-all duration-200"
                            aria-label={labels.close}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Left — Product Image */}
                        <div className="relative w-full md:w-2/5 flex-shrink-0 h-64 md:h-auto bg-stone-100 dark:bg-gray-800">
                            {product.primaryImage ? (
                                <Image
                                    src={product.primaryImage}
                                    alt={name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Package className="w-20 h-20 text-stone-300 dark:text-gray-600" />
                                </div>
                            )}
                            {/* Image gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20 pointer-events-none" />

                            {/* Badge stack on image */}
                            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                                {product.isOrganic && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                        <Leaf className="w-3 h-3" />
                                        {labels.organic}
                                    </span>
                                )}
                                {product.isExportGrade && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                        <Award className="w-3 h-3" />
                                        {labels.export}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right — Story Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-green-600 dark:text-green-500">
                                        {category}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 dark:text-white leading-tight mb-4 arima-font">
                                    {name}
                                </h2>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-semibold">
                                    {labels.productStory}
                                </p>
                            </div>

                            {/* Story Content (Rich Text) */}
                            {story && (
                                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-gray-800/60 border border-stone-100 dark:border-gray-700/50">
                                    <div
                                        className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-light prose prose-stone dark:prose-invert max-w-none
                                        [&>p]:mb-4 [&>p:last-child]:mb-0
                                        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                                        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                                        [&>a]:text-green-600 [&>a]:underline hover:[&>a]:text-green-700
                                        [&>strong]:font-bold [&>strong]:text-gray-900 dark:[&>strong]:text-white"
                                        dangerouslySetInnerHTML={{ __html: story }}
                                    />
                                </div>
                            )}

                            {/* Product Facts Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {facts.map(({ icon: Icon, label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/40 flex items-center justify-center mt-0.5">
                                            <Icon className="w-4 h-4 text-green-600 dark:text-green-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">
                                                {label}
                                            </p>
                                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug font-medium">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price footer (Price removed) */}
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-full bg-green-600 text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-green-700 active:scale-95 transition-all duration-200 shadow-md"
                                >
                                    {labels.close}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
