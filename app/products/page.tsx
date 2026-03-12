'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { ArrowRight, Search, X as ClearIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductStoryCard from '@/components/product/ProductStoryCard'
import ProductStoryModal from '@/components/product/ProductStoryModal'

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

export default function ProductsPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')

    useEffect(() => { setIsMounted(true) }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/products?status=ACTIVE&limit=100')
                const data = await res.json()
                if (res.ok) setProducts(data.products || [])
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const t = {
        en: {
            title: "Nature's Harvest",
            subtitle: "A silent dialogue between soil and soul. Every harvest is a fragment of time, preserved for the conscious few.",
            harvest: 'Harvesting',
            organic: 'ORGANIC',
            heritage: 'HERITAGE',
            export: 'EXPORT',
            loading: 'Deciphering the journals...',
            categoryTitle: 'The Grove Chronicles',
            explore: 'Discover',
            viewStory: 'View Story',
            searchPlaceholder: 'Search products…',
            allCategory: 'All',
            noResults: 'No products found.',
            origin: 'Origin',
            cultivation: 'Cultivation',
            harvesting: 'Harvesting',
            quality: 'Quality',
            close: 'Close',
            productStory: 'Product Story',
            perUnit: 'Price per unit',
            pactTitle: 'The Pact of Purity',
            pactDesc: 'Every harvest is a fragment of history. Tucked into the valley of Oddanchatram, our groves exist as a sanctuary for the patient, the pure, and those who seek the original flavor of life.',
        },
        ta: {
            title: 'இயற்கையின் அறுவடை',
            subtitle: 'மண்ணுக்கும் ஆன்மாவுக்கும் இடையிலான ஒரு மௌன உரையாடல். ஒவ்வொரு அறுவடையும் ஒரு காலத்தின் துளி.',
            harvest: 'அறுவடை காலம்',
            organic: 'தூய இயற்கை',
            heritage: 'பாரம்பரியம்',
            export: 'ஏற்றுமதி',
            loading: 'காலத்தின் சுவடுகளைத் தேடுகிறோம்...',
            categoryTitle: 'எங்கள் பாரம்பரியம்',
            explore: 'கண்டறியுங்கள்',
            viewStory: 'கதை காண்க',
            searchPlaceholder: 'தயாரிப்புகளை தேடுங்கள்…',
            allCategory: 'அனைத்தும்',
            noResults: 'தயாரிப்புகள் கிடைக்கவில்லை.',
            origin: 'தோற்றம்',
            cultivation: 'சாகுபடி',
            harvesting: 'அறுவடை',
            quality: 'தரம்',
            close: 'மூடு',
            productStory: 'தயாரிப்பு கதை',
            perUnit: 'ஒரு யூனிட்டுக்கான விலை',
            pactTitle: 'இயற்கையுடன் ஒரு பயணம்',
            pactDesc: 'ஒவ்வொரு தயாரிப்பும் ஒரு கதை சொல்கிறது. ஒட்டன்சத்திரத்தின் இதயத்தில் அமைந்துள்ள எமது தோட்டம், இயற்கையின் தூய்மையை உங்கள் இல்லங்களுக்குக் கொண்டு வரும் ஒரே நோக்கத்துடன் வளர்ந்து வருகிறது.',
        }
    }

    const content = isMounted ? t[language] : t.en

    // Derive unique categories from the product list
    const categories = useMemo(() => {
        const seen = new Map<string, { id: string; nameEn: string; nameTa?: string; slug: string }>()
        products.forEach(p => {
            if (!seen.has(p.category.id)) seen.set(p.category.id, p.category)
        })
        return Array.from(seen.values())
    }, [products])

    // Client-side filter: search + category
    const filteredProducts = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        return products.filter(p => {
            const nameMatch =
                !q ||
                p.name.toLowerCase().includes(q) ||
                (p.nameTa && p.nameTa.includes(q)) ||
                (p.shortDescEn && p.shortDescEn.toLowerCase().includes(q))
            const categoryMatch =
                activeCategory === 'all' || p.category.id === activeCategory
            return nameMatch && categoryMatch
        })
    }, [products, searchQuery, activeCategory])

    const handleCloseModal = useCallback(() => setSelectedProduct(null), [])

    const modalLabels = {
        origin: content.origin,
        cultivation: content.cultivation,
        harvesting: content.harvest,
        quality: content.quality,
        close: content.close,
        organic: content.organic,
        export: content.export,
        productStory: content.productStory,
        perUnit: content.perUnit,
    }

    return (
        <div className="min-h-screen bg-[#FDFCF9] dark:bg-gray-950 transition-colors duration-300 arima-font">
            <Header />

            {/* ── Cinematic Hero (unchanged) ── */}
            <section
                className="relative h-[50vh] flex items-center justify-center overflow-hidden"
                data-testid="products-hero-section"
            >
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/images/hero.png"
                        alt="Lourdes Garden Heritage"
                        fill
                        className="object-cover brightness-75 lg:brightness-90"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFCF9] dark:to-gray-950" />
                </motion.div>

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white text-[10px] tracking-[0.3em] uppercase mb-12"
                    >
                        {content.categoryTitle}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.95]"
                    >
                        {content.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1.5 }}
                        className="text-base md:text-lg text-white/70 max-w-xl mx-auto font-light italic leading-relaxed tracking-wide"
                    >
                        {content.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-10"
                    >
                        <button
                            onClick={() => document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-12 py-5 rounded-full bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
                            data-testid="products-explore-scroll-button"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {content.explore} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── Product Showcase ── */}
            <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Search + Category Filter controls */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                    {/* Search bar */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={content.searchPlaceholder}
                            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                aria-label="Clear search"
                            >
                                <ClearIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Category filter pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border transition-all duration-200 ${activeCategory === 'all'
                                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-700 dark:hover:text-green-500'
                                }`}
                        >
                            {content.allCategory}
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border transition-all duration-200 ${activeCategory === cat.id
                                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-700 dark:hover:text-green-500'
                                    }`}
                            >
                                {isMounted && language === 'ta' && cat.nameTa ? cat.nameTa : cat.nameEn}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-green-600 dark:border-t-green-500 rounded-full mb-6"
                        />
                        <p className="text-sm tracking-widest uppercase opacity-50 italic">{content.loading}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <p className="text-gray-400 dark:text-gray-500 italic tracking-widest text-sm">{content.noResults}</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory + searchQuery}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {filteredProducts.map((product, index) => (
                                <ProductStoryCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    language={isMounted ? language : 'en'}
                                    onViewStory={setSelectedProduct}
                                    labelOrganic={content.organic}
                                    labelExport={content.export}
                                    labelViewStory={content.viewStory}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </section>

            {/* ── Visionary Footer Banner ── */}
            <section className="bg-white dark:bg-gray-950 py-24 border-t border-gray-50 dark:border-gray-900">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 30 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tighter"
                    >
                        {content.pactTitle}
                    </motion.h2>
                    <motion.p
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1.5 }}
                        className="text-lg md:text-xl text-gray-400 leading-[1.8] font-light italic max-w-2xl mx-auto"
                    >
                        {content.pactDesc}
                    </motion.p>
                </div>
            </section>

            <Footer />

            {/* ── Product Story Modal ── */}
            <ProductStoryModal
                product={selectedProduct}
                language={isMounted ? language : 'en'}
                labels={modalLabels}
                onClose={handleCloseModal}
            />

            <style jsx global>{`
                .arima-font {
                    font-family: 'Arima', sans-serif;
                }
            `}</style>
        </div>
    )
}
