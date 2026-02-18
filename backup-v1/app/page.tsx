'use client'

import Header from '@/components/layout/Header'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Users, Globe, ArrowRight } from 'lucide-react'
import AddToCartButton from '@/components/product/AddToCartButton'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { language } = useLanguageStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      footer: {
        desc: 'Premium organic agricultural products from the mountains of Tamil Nadu. Dedicated to sustainable farming and global excellence.',
        explore: 'Explore',
        contact: 'Contact',
        rights: 'All rights reserved.',
      }
    },
    ta: {
      heroTitle: 'லூர்து கார்டன்',
      heroSubtitle: 'எங்கள் பண்ணையிலிருந்து உலகிற்கு',
      heroDesc: 'தமிழ்நாட்டின் மூடுபனி மலைகளில் இயற்கையாக வளர்க்கப்படும் உயர்தர ஆர்கானிக் விவசாய பொருட்கள்.',
      shopBtn: 'தயாரிப்புகளைப் பாருங்கள்',
      storyBtn: 'எங்கள் கதை',
      features: {
        organicTitle: '100% இயற்கை (Organic)',
        organicDesc: 'ரசாயன பூச்சிக்கொல்லிகள் அல்லது உரங்கள் இன்றி வளர்க்கப்படுகிறது. எங்கள் மண்ணிலிருந்து நேரடியாக தூய மற்றும் ஆரோக்கியமான தயாரிப்புகள்.',
        exportTitle: 'ஏற்றுமதி தரம்',
        exportDesc: 'சர்வதேச ஏற்றுமதி சந்தைகளுக்கான தரமான தயாரிப்புகள், உலகளாவிய தரத்தை பூர்த்தி செய்கின்றன.',
        wholesaleTitle: 'மொத்த விற்பனை (B2B)',
        wholesaleDesc: 'உலகளாவிய வணிகங்களுக்கு போட்டித்தன்மை வாய்ந்த மொத்த விலையில் வழங்கி வருகிறோம்.',
      },
      featuredTitle: 'சிறப்பு அறுவடை',
      footer: {
        desc: 'தமிழ்நாட்டின் மலைப்பகுதிகளில் இருந்து உயர்தர இயற்கை விவசாய பொருட்கள். நிலையான விவசாயம் மற்றும் உலகளாவிய மேன்மைக்கு அர்ப்பணிக்கப்பட்டது.',
        explore: 'ஆராயுங்கள்',
        contact: 'தொடர்பு கொள்ள',
        rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      }
    }
  }

  const content = isMounted ? t[language] : t.en

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch('/api/products?status=ACTIVE&isFeatured=true')
        const data = await res.json()
        if (res.ok) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen transition-colors duration-300 arima-font">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Lourdes Garden Farm"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            🌿 {content.heroTitle}
          </h2>
          <p className="text-2xl md:text-3xl font-light mb-8 drop-shadow-md">
            {content.heroSubtitle}
          </p>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10">
            {content.heroDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#products"
              className="px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-semibold text-lg flex items-center gap-2"
            >
              {content.shopBtn} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white/30 transition font-semibold text-lg"
            >
              {content.storyBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="bg-green-50 dark:bg-green-900/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <Leaf className="w-10 h-10 text-green-600 dark:text-green-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.features.organicTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.features.organicDesc}
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Globe className="w-10 h-10 text-blue-600 dark:text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.features.exportTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.features.exportDesc}
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-purple-50 dark:bg-purple-900/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Users className="w-10 h-10 text-purple-600 dark:text-purple-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{content.features.wholesaleTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.features.wholesaleDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="bg-gray-50 dark:bg-gray-900/50 py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{content.featuredTitle}</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.primaryImage || '/images/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {language === 'ta' && product.nameTa ? product.nameTa : product.name}
                  </h4>
                  <p className="text-green-600 dark:text-green-400 font-bold text-lg mb-6">₹{product.retailPrice}/{product.unit || 'kg'}</p>

                  <div className="mt-auto">
                    <AddToCartButton product={{ ...product, slug: product.slug }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold">{content.heroTitle}</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                {content.footer.desc}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">{content.footer.explore}</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/" className="hover:text-green-500 transition">{language === 'ta' ? 'முகப்பு' : 'Home'}</Link></li>
                <li><Link href="/about" className="hover:text-green-500 transition">{content.storyBtn}</Link></li>
                <li><Link href="/#products" className="hover:text-green-500 transition">{content.footer.explore === 'ஆராயுங்கள்' ? 'தயாரிப்புகள்' : 'Products'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">{content.footer.contact}</h4>
              <ul className="space-y-4 text-gray-400">
                <li>{language === 'ta' ? 'தமிழ்நாடு, இந்தியா' : 'Tamil Nadu, India'}</li>
                <li>info@lourdesgarden.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 {content.heroTitle}. {content.footer.rights}</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
