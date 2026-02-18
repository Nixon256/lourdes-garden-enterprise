'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

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

interface Category {
    id: string
    nameEn: string
    nameTa?: string
    slug: string
}

export default function ProductsPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsRes = await fetch('/api/products?status=ACTIVE&limit=100')
                const productsData = await productsRes.json()

                if (productsRes.ok) setProducts(productsData.products || [])
            } catch (error) {
                console.error('Failed to fetch data:', error)
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
            loading: 'Deciphering the journals...',
            categoryTitle: 'The Grove Chronicles',
            explore: 'Discover'
        },
        ta: {
            title: 'இயற்கையின் அறுவடை',
            subtitle: 'மண்ணுக்கும் ஆன்மாவுக்கும் இடையிலான ஒரு மௌன உரையாடல். ஒவ்வொரு அறுவடையும் ஒரு காலத்தின் துளி.',
            harvest: 'அறுவடை காலம்',
            organic: 'தூய இயற்கை',
            heritage: 'பாரம்பரியம்',
            loading: 'காலத்தின் சுவடுகளைத் தேடுகிறோம்...',
            categoryTitle: 'எங்கள் பாரம்பரியம்',
            explore: 'கண்டறியுங்கள்'
        }
    }

    const content = isMounted ? t[language] : t.en

    const filteredProducts = products

    return (
        <div className="min-h-screen bg-[#FDFCF9] dark:bg-gray-950 transition-colors duration-300 arima-font">
            <Header />

            {/* Cinematic Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
                        className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-10 leading-[0.95]"
                    >
                        {content.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1.5 }}
                        className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light italic leading-relaxed tracking-wide"
                    >
                        {content.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-16"
                    >
                        <button
                            onClick={() => document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-12 py-5 rounded-full bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {content.explore} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>


            {/* Editorial Showcase */}
            <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full mb-6"
                        />
                        <p className="text-sm tracking-widest uppercase opacity-50 italic">{content.loading}</p>
                    </div>
                ) : (
                    <div className="space-y-[32rem]">
                        {products.map((product, index) => (
                            <motion.article
                                key={product.id}
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-24 lg:gap-40`}
                            >
                                {/* Immersive Heritage Frame */}
                                <div className="relative w-full lg:w-3/5 group">
                                    {/* Vertical Masthead Label */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 hidden lg:block ${index % 2 === 0 ? '-left-16' : '-right-16'}`}>
                                        <span className={`text-[10px] tracking-[0.6em] font-bold text-gray-300 dark:text-gray-800 uppercase vertical-text transform ${index % 2 === 0 ? 'rotate-180' : ''}`}>
                                            {product.isOrganic ? content.organic : content.heritage}
                                        </span>
                                    </div>

                                    <motion.div
                                        whileHover={{ scale: 0.985 }}
                                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative aspect-[4/5] w-full rounded-[0.2rem] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-900 shadow-sm"
                                    >
                                        <motion.div
                                            initial={{ scale: 1.05 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="h-full w-full"
                                        >
                                            <Image
                                                src={product.primaryImage || '/images/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-all duration-1000 group-hover:scale-105 sepia-[0.05] grayscale-[0.05] hover:sepia-0 hover:grayscale-0"
                                                priority={index < 2}
                                            />
                                        </motion.div>

                                        {/* Inset botanical border on hover */}
                                        <div className="absolute inset-8 border border-white/0 group-hover:border-white/20 transition-all duration-700 pointer-events-none" />
                                    </motion.div>
                                </div>

                                {/* Narrative Journal Content */}
                                <div className="w-full lg:w-2/5 flex flex-col items-start px-4">
                                    <div className="flex items-center gap-4 mb-6 opacity-40">
                                        <span className="text-[10px] tracking-[0.4em] font-bold uppercase">
                                            {language === 'ta' && product.category?.nameTa ? product.category.nameTa : product.category?.nameEn}
                                        </span>
                                        <div className="h-[1px] w-8 bg-current" />
                                        <span className="text-[10px] tracking-[0.4em] font-bold uppercase">{product.unit}</span>
                                    </div>

                                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white mb-10 leading-[0.95]">
                                        {language === 'ta' && product.nameTa ? product.nameTa : product.name}
                                    </h2>

                                    <div className="space-y-8 mb-12">
                                        <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed font-light italic opacity-85 first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
                                            {language === 'ta' ? product.storyTa : product.storyEn}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start gap-6">
                                        <div className="flex flex-wrap gap-4">
                                            {product.isOrganic && (
                                                <div className="px-4 py-1.5 text-[9px] tracking-[0.2em] font-bold uppercase border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-500 bg-green-50/30 dark:bg-green-950/20 rounded-full">
                                                    {content.organic}
                                                </div>
                                            )}
                                            {product.harvestingSeason && (
                                                <div className="px-4 py-1.5 text-[9px] tracking-[0.2em] font-bold uppercase border border-stone-200 dark:border-stone-800 text-stone-500 bg-stone-50/30 dark:bg-stone-900/20 rounded-full">
                                                    {content.harvest}: {product.harvestingSeason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </section>

            {/* Visionary Footer Section */}
            <section className="bg-white dark:bg-gray-950 py-64 border-t border-gray-50 dark:border-gray-900">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 30 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-12 tracking-tighter"
                    >
                        {language === 'ta' ? 'இயற்கையுடன் ஒரு பயணம்' : 'The Pact of Purity'}
                    </motion.h2>
                    <motion.p
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1.5 }}
                        className="text-xl md:text-2xl text-gray-400 leading-[1.8] font-light italic max-w-3xl mx-auto"
                    >
                        {language === 'ta'
                            ? 'ஒவ்வொரு தயாரிப்பும் ஒரு கதை சொல்கிறது. ஒட்டன்சத்திரத்தின் இதயத்தில் அமைந்துள்ள எமது தோட்டம், இயற்கையின் தூய்மையை உங்கள் இல்லங்களுக்குக் கொண்டு வரும் ஒரே நோக்கத்துடன் வளர்ந்து வருகிறது.'
                            : 'Every harvest is a fragment of history. Tucked into the valley of Oddanchatram, our groves exist as a sanctuary for the patient, the pure, and those who seek the original flavor of life.'}
                    </motion.p>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
                .arima-font {
                    font-family: 'Arima', sans-serif;
                }
            `}</style>
        </div>
    )
}
