'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Users, Globe, ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import BusinessGrowthSection from '@/components/sections/BusinessGrowthSection'
import ProductStoryCard from '@/components/product/ProductStoryCard'
import ProductStoryModal from '@/components/product/ProductStoryModal'

// Reusable scroll-reveal wrapper
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const { language } = useLanguageStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const t = {
    en: {
      heroTitle: 'Lourdes Garden',
      heroSubtitle: 'From Our Farm to the World',
      heroDesc: 'Premium organic agricultural products grown naturally in the misty mountains of Tamil Nadu.',
      shopBtn: 'Shop Collection',
      storyBtn: 'Our Story',
      features: {
        organicTitle: '100% Organic',
        organicDesc: 'Grown without chemical pesticides or fertilizers. Pure, natural, and healthy products direct from our soil.',
        exportTitle: 'Export Quality',
        exportDesc: 'Premium grade products certified for international export markets, meeting global standards of excellence.',
        wholesaleTitle: 'B2B & Wholesale',
        wholesaleDesc: 'Serving businesses worldwide with bulk orders and competitive wholesale pricing for global distribution.',
      },
      featuredTitle: 'Featured Harvest',
      explore: 'Discover',
      viewStory: 'View Story',
      organic: 'ORGANIC',
      export: 'EXPORT',
      origin: 'Origin',
      cultivation: 'Cultivation',
      harvest: 'Harvesting',
      quality: 'Quality',
      close: 'Close',
      productStory: 'Product Story',
      perUnit: 'Price per unit',
    },
    ta: {
      heroTitle: 'லூர்து கார்டன்',
      heroSubtitle: 'எங்கள் பண்ணையிலிருந்து உலகிற்கு',
      heroDesc: 'தமிழ்நாட்டின் மூடுபனி மலைகளில் இயற்கையாக வளர்க்கப்படும் உயர்தர ஆர்கானிக் விவசாய பொருட்கள்.',
      shopBtn: 'தயாரிப்புகளைப் பாருங்கள்',
      storyBtn: 'எங்கள் கதை',
      features: {
        organicTitle: '100% இயற்கை (Organic)',
        organicDesc: 'ரசாயன பூச்சிக்கொல்லிகள் அல்லது உரங்கள் இன்றி வளர்க்கப்படுகிறது.',
        exportTitle: 'ஏற்றுமதி தரம்',
        exportDesc: 'சர்வதேச ஏற்றுமதி சந்தைகளுக்கான தரமான தயாரிப்புகள்.',
        wholesaleTitle: 'மொத்த விற்பனை (B2B)',
        wholesaleDesc: 'உலகளாவிய வணிகங்களுக்கு போட்டித்தன்மை வாய்ந்த மொத்த விலையில் வழங்கி வருகிறோம்.',
      },
      featuredTitle: 'சிறப்பு அறுவடை',
      explore: 'கண்டறியுங்கள்',
      viewStory: 'கதை காண்க',
      organic: 'தூய இயற்கை',
      export: 'ஏற்றுமதி',
      origin: 'தோற்றம்',
      cultivation: 'சாகுபடி',
      harvest: 'அறுவடை',
      quality: 'தரம்',
      close: 'மூடு',
      productStory: 'தயாரிப்பு கதை',
      perUnit: 'ஒரு யூனிட்டுக்கான விலை',
    }
  }

  const content = isMounted ? t[language] : t.en
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch('/api/products?status=ACTIVE&isFeatured=true&limit=12')
        const data = await res.json()
        if (res.ok) setProducts(data.products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    fetchFeaturedProducts()
  }, [])

  // Parallax setup for hero
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const heroImageY = useTransform(scrollY, [0, 600], [0, 90])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const featureIcons = [Leaf, Globe, Users]
  const featureColors = [
    { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-500', hover: 'group-hover:bg-green-600' },
    { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-500', hover: 'group-hover:bg-blue-600' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-500', hover: 'group-hover:bg-purple-600' },
  ]

  const handleCloseModal = () => setSelectedProduct(null)

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
    <div className="min-h-screen transition-colors duration-300 arima-font">
      <Header />

      {/* ── Hero Section with Parallax ── */}
      <section
        ref={heroRef}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        data-testid="home-hero-section"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ y: heroImageY }}
          className="absolute inset-0 scale-110"
        >
          <Image
            src="/images/hero.png"
            alt="Lourdes Garden Farm"
            fill
            className="object-cover"
            priority
            data-testid="home-hero-image"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

        {/* Hero Content — staggered entrance */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center text-white px-4 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs tracking-[0.3em] uppercase font-semibold"
          >
            Tamil Nadu · India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-7xl font-bold mb-5 drop-shadow-lg tracking-tighter"
          >
            🌿 {content.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl md:text-3xl font-light mb-5 drop-shadow-md"
          >
            {content.heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10"
          >
            {content.heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/products"
              className="px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-lg flex items-center gap-2 shadow-lg shadow-green-700/30"
              data-testid="home-hero-shop-button"
            >
              {content.shopBtn} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-lg"
              data-testid="home-hero-story-button"
            >
              {content.storyBtn}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Grid with Scroll Reveal ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[content.features.organicTitle, content.features.exportTitle, content.features.wholesaleTitle].map((title, idx) => {
            const Icon = featureIcons[idx]
            const c = featureColors[idx]
            const descs = [content.features.organicDesc, content.features.exportDesc, content.features.wholesaleDesc]
            const testIds = ['home-feature-organic', 'home-feature-export', 'home-feature-wholesale']
            return (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="text-center group" data-testid={testIds[idx]}>
                  <div className={`${c.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${c.hover} group-hover:text-white transition-all duration-300`}>
                    <Icon className={`w-10 h-10 ${c.icon} group-hover:text-white`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{descs[idx]}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── Featured Products with Scroll Reveal + Card Hover ── */}
      <section id="products" className="bg-gray-50 dark:bg-gray-900/50 py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{content.featuredTitle}</h2>
              <div className="w-24 h-1 bg-green-600 mx-auto rounded-full" />
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product, idx) => (
                <ProductStoryCard
                  key={product.id}
                  product={product}
                  index={idx}
                  language={isMounted ? language : 'en'}
                  onViewStory={setSelectedProduct}
                  labelOrganic={content.organic}
                  labelExport={content.export}
                  labelViewStory={content.viewStory}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Business Growth & Impact Section */}
      <BusinessGrowthSection />

      {/* Footer */}
      <Footer />

      {/* Product Story Modal */}
      <ProductStoryModal
        product={selectedProduct}
        language={isMounted ? language : 'en'}
        labels={modalLabels}
        onClose={handleCloseModal}
      />
    </div>
  )
}
