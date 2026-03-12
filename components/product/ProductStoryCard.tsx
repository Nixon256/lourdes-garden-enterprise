'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpen, Package, Leaf, Award } from 'lucide-react'

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

interface ProductStoryCardProps {
    product: Product
    index: number
    language: string
    onViewStory: (product: Product) => void
    labelOrganic: string
    labelExport: string
    labelViewStory: string
}

export default function ProductStoryCard({
    product,
    index,
    language,
    onViewStory,
    labelOrganic,
    labelExport,
    labelViewStory,
}: ProductStoryCardProps) {
    const name = language === 'ta' && product.nameTa ? product.nameTa : product.name
    const shortDesc =
        language === 'ta' && product.shortDescTa
            ? product.shortDescTa
            : product.shortDescEn || product.descriptionEn

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            data-testid={`product-article-${product.id}`}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col"
            onClick={() => onViewStory(product)}
        >
            {/* Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-50 dark:bg-gray-800">
                {product.primaryImage ? (
                    <Image
                        src={product.primaryImage}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={index < 4}
                        data-testid={`product-image-${product.id}`}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Package className="w-16 h-16 text-stone-300 dark:text-gray-600" />
                    </div>
                )}

                {/* Gradient overlay fade at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isOrganic && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-600/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-[0.15em] uppercase shadow-sm">
                            <Leaf className="w-2.5 h-2.5" />
                            {labelOrganic}
                        </span>
                    )}
                    {product.isExportGrade && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-[0.15em] uppercase shadow-sm">
                            <Award className="w-2.5 h-2.5" />
                            {labelExport}
                        </span>
                    )}
                </div>

                {/* Category chip — bottom left on hover */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-[9px] font-bold tracking-[0.15em] uppercase text-gray-600 dark:text-gray-300 backdrop-blur-sm shadow">
                        {language === 'ta' && product.category?.nameTa
                            ? product.category.nameTa
                            : product.category?.nameEn}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-1 line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {shortDesc}
                    </p>
                </div>



                <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">
                        {product.unit}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewStory(product)
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[10px] font-bold tracking-[0.12em] uppercase border border-green-100 dark:border-green-900/40 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-all duration-300"
                        aria-label={`${labelViewStory}: ${name}`}
                    >
                        <BookOpen className="w-3 h-3" />
                        {labelViewStory}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
