'use client'

import { useEffect, useRef, useState } from 'react'
import {
    TrendingUp, Leaf, Globe, Award, Truck, ShieldCheck,
    MapPin, Package, Users, BarChart3, ArrowRight, Star,
    CalendarDays, Sprout, HandCoins, FlaskConical, ClipboardCheck,
    Warehouse, FileCheck2, BadgeCheck, Building2
} from 'lucide-react'
import Link from 'next/link'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { motion } from 'framer-motion'

// Eased counter hook — easeOutExpo curve for premium feel
function useCountUp(target: number, duration = 2200, isVisible: boolean) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!isVisible) return
        let startTime: number | null = null
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
            else setCount(target)
        }
        const raf = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(raf)
    }, [target, duration, isVisible])
    return count
}

interface StatConfig {
    icon: any
    value: number
    suffix: string
    label: string
    labelTa: string
    bgColor: string
    textColor: string
    glowColor: string
}

function StatCard({ icon: Icon, value, suffix, label, labelTa, bgColor, textColor, glowColor, isVisible, language, index }: StatConfig & { isVisible: boolean; language: string; index: number }) {
    const count = useCountUp(value, 2200, isVisible)
    const testId = label.toLowerCase().replace(/[\s&()]+/g, '-')
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            data-testid={`stat-card-${testId}`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} opacity-10 rounded-full -translate-y-8 translate-x-8`} />
            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
            </div>
            <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{count}</span>
                <span className={`text-2xl font-bold ${textColor} mb-1`}>{suffix}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {language === 'ta' ? labelTa : label}
            </p>
        </motion.div>
    )
}

function ChainStep({ step, icon: Icon, title, titleTa, desc, descTa, isLast, language }: {
    step: number; icon: any; title: string; titleTa: string; desc: string; descTa: string; isLast: boolean; language: string
}) {
    return (
        <div className="flex flex-col items-center gap-3 text-center" data-testid={`supply-chain-step-${step}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0 hover:scale-105 transition-transform">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                    {language === 'ta' ? `படி ${step}` : `Step ${step}`}
                </span>
                <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {language === 'ta' ? titleTa : title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {language === 'ta' ? descTa : desc}
                </p>
            </div>
        </div>
    )
}

export default function BusinessGrowthSection() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)
    const { language } = useLanguageStore()

    useEffect(() => { setIsMounted(true) }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const lang = isMounted ? language : 'en'

    // ── Translations ──────────────────────────────────────────────────────
    const text = {
        en: {
            badge: 'Business Growth & Impact',
            heading: 'Built for Global Scale',
            subheading: 'From a 10-acre misty mountain grove to an enterprise-grade export platform — a living proof that heritage meets innovation.',
            productionHeading: 'Production Capacity at a Glance',
            productionDesc: "Our highlands yield some of India's finest organic produce — available in bulk for international wholesale.",
            supplyChainLabel: 'End-to-End Process',
            supplyChainHeading: 'Farm-to-Global Supply Chain',
            supplyChainDesc: 'End-to-end traceability from our mountain grove to your port',
            certLabel: 'Compliance',
            certHeading: 'Certifications & Standards',
            certDesc: 'Committed to international standards at every stage',
            networkLabel: 'Network',
            networkHeading: 'Our Network & Partners',
            networkDesc: 'Building a global ecosystem of trusted agricultural relationships',
            partnerNote: 'Partner logos displayed upon formal agreements',
            ctaHeading: 'Interested in a Partnership?',
            ctaDesc: 'We are actively seeking wholesale buyers, export distributors, and long-term agricultural investment partners.',
            ctaBtn: 'Start a Conversation',
            products: [
                { label: 'Black Pepper', detail: 'Grade A Export | ~2 MT/yr' },
                { label: 'Green Cardamom', detail: '8mm Premium | ~500 Kg/yr' },
                { label: 'Mountain Banana', detail: 'G9 Quality | Seasonal' },
                { label: 'Teak & Silver Oak', detail: 'Long-term Asset Plantation' },
            ],
        },
        ta: {
            badge: 'வணிக வளர்ச்சி & தாக்கம்',
            heading: 'உலக அளவில் வளர்க்கப்பட்டது',
            subheading: '10 ஏக்கர் மலை தோட்டத்திலிருந்து தொழில்முனைவு ஏற்றுமதி தளம் வரை — பாரம்பரியமும் நவீனமும் இணையும் இடம்.',
            productionHeading: 'உற்பத்தி திறன் - ஒரு பார்வை',
            productionDesc: 'எங்கள் மலைப்பகுதி இந்தியாவின் சிறந்த இயற்கை விளைபொருட்களை வழங்குகிறது — சர்வதேச மொத்த வர்த்தகத்திற்கு கிடைக்கின்றது.',
            supplyChainLabel: 'முழு செயல்முறை',
            supplyChainHeading: 'தோட்டம் முதல் உலகம் வரை',
            supplyChainDesc: 'எங்கள் மலை தோட்டத்திலிருந்து உங்கள் துறைமுகம் வரை முழுமையான கண்காணிப்பு',
            certLabel: 'இணங்குதல்',
            certHeading: 'சான்றிதழ்கள் & தரங்கள்',
            certDesc: 'ஒவ்வொரு கட்டத்திலும் சர்வதேச தரங்களுக்கு அர்ப்பணிக்கப்பட்டது',
            networkLabel: 'நெட்வொர்க்',
            networkHeading: 'எங்கள் நெட்வொர்க் & பங்காளர்கள்',
            networkDesc: 'நம்பகமான விவசாய உறவுகளின் உலகளாவிய சுற்றுச்சூழல் அமைப்பை உருவாக்குகிறோம்',
            partnerNote: 'முறையான ஒப்பந்தங்களுக்குப் பிறகு பங்காளர் சின்னங்கள் காட்டப்படும்',
            ctaHeading: 'கூட்டுறவுக்கு ஆர்வமா?',
            ctaDesc: 'மொத்த வாங்குபவர்கள், ஏற்றுமதி விநியோகஸ்தர்கள் மற்றும் நீண்டகால விவசாய முதலீட்டு பங்காளர்களை நாங்கள் தேடுகிறோம்.',
            ctaBtn: 'உரையாடலை தொடங்கவும்',
            products: [
                { label: 'கருமிளகு', detail: 'A தர ஏற்றுமதி | ~2 மெட்ரிக் டன்/ஆண்டு' },
                { label: 'பச்சை ஏலக்காய்', detail: '8mm உயர்தரம் | ~500 கிலோ/ஆண்டு' },
                { label: 'மலை வாழைப்பழம்', detail: 'G9 தரம் | பருவகால' },
                { label: 'தேக்கு & வெள்ளி ஓக்', detail: 'நீண்ட கால சொத்து நடவு' },
            ],
        }
    }

    const t = text[lang as keyof typeof text]

    const stats: StatConfig[] = [
        { icon: MapPin, value: 10, suffix: '+', label: 'Acres of Heritage Grove', labelTa: 'ஏக்கர் பாரம்பரிய தோட்டம்', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400', glowColor: 'bg-green-500' },
        { icon: CalendarDays, value: 5, suffix: '+', label: 'Years of Farming Legacy', labelTa: 'ஆண்டு விவசாய பாரம்பரியம்', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-600 dark:text-emerald-400', glowColor: 'bg-emerald-500' },
        { icon: Globe, value: 6, suffix: '+', label: 'Global Export Markets', labelTa: 'உலக ஏற்றுமதி சந்தைகள்', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400', glowColor: 'bg-blue-500' },
        { icon: Sprout, value: 12, suffix: '+', label: 'Premium Product Lines', labelTa: 'உயர்தர தயாரிப்பு வரிசைகள்', bgColor: 'bg-teal-100 dark:bg-teal-900/30', textColor: 'text-teal-600 dark:text-teal-400', glowColor: 'bg-teal-500' },
        { icon: Users, value: 100, suffix: '+', label: 'B2B Wholesale Clients', labelTa: 'மொத்த வர்த்தக வாடிக்கையாளர்கள்', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600 dark:text-purple-400', glowColor: 'bg-purple-500' },
        { icon: HandCoins, value: 25, suffix: 'L+', label: 'Enterprise Valuation (₹)', labelTa: 'நிறுவன மதிப்பீடு (₹)', bgColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400', glowColor: 'bg-amber-500' },
    ]

    const supplyChain = [
        { icon: Sprout, title: 'Farm Cultivation', titleTa: 'தோட்ட சாகுபடி', desc: 'Organic growth across 10+ acres of mountain terrain', descTa: '10+ ஏக்கர் மலை நிலம் முழுவதும் இயற்கை சாகுபடி' },
        { icon: FlaskConical, title: 'Quality Grading', titleTa: 'தர வகைப்படுத்தல்', desc: '5-level export grading for precision consistency', descTa: 'துல்லியமான ஏற்றுமதிக்கு 5 நிலை தர வகைப்படுத்தல்' },
        { icon: Warehouse, title: 'Premium Packaging', titleTa: 'உயர்தர பேக்கேஜிங்', desc: 'Airtight, eco-conscious packaging for freshness', descTa: 'புதுமைக்கு காற்றடைக்கப்பட்ட, சுற்றுச்சூழல் நட்பு பேக்கேஜிங்' },
        { icon: Truck, title: 'Global Logistics', titleTa: 'உலக தளவாடங்கள்', desc: 'Farm-to-port delivery via BlueDart & DHL ready', descTa: 'BlueDart & DHL மூலம் தோட்டத்திலிருந்து துறைமுகம் வரை' },
        { icon: Globe, title: 'Export Delivery', titleTa: 'ஏற்றுமதி விநியோகம்', desc: 'Reaching EU, Middle East & SE Asia markets', descTa: 'EU, மத்திய கிழக்கு & தென்கிழக்கு ஆசியா சந்தைகளை அடைகிறது' },
    ]

    const certifications = [
        { icon: Leaf, label: 'Organic Certification', labelTa: 'இயற்கை சான்றிதழ்', status: 'In Progress', statusTa: 'நடந்துகொண்டிருக்கிறது', badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', iconColor: 'text-amber-500' },
        { icon: ClipboardCheck, label: 'FSSAI Registered', labelTa: 'FSSAI பதிவு செய்யப்பட்டது', status: 'Active', statusTa: 'செயலில் உள்ளது', badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', iconColor: 'text-green-500' },
        { icon: FileCheck2, label: 'Export License', labelTa: 'ஏற்றுமதி உரிமம்', status: 'Active', statusTa: 'செயலில் உள்ளது', badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', iconColor: 'text-green-500' },
        { icon: ShieldCheck, label: 'Phytosanitary Ready', labelTa: 'தாவர சுகாதார தயார்', status: 'Active', statusTa: 'செயலில் உள்ளது', badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', iconColor: 'text-green-500' },
        { icon: BadgeCheck, label: 'ISO 22000 (Food Safety)', labelTa: 'ISO 22000 (உணவு பாதுகாப்பு)', status: 'Planned', statusTa: 'திட்டமிடப்பட்டது', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', iconColor: 'text-blue-400' },
        { icon: Award, label: 'Global GAP Certification', labelTa: 'உலக GAP சான்றிதழ்', status: 'Planned', statusTa: 'திட்டமிடப்பட்டது', badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', iconColor: 'text-blue-400' },
    ]

    const partners = [
        { name: 'Tamil Nadu Agri Dept.', nameTa: 'தமிழ்நாடு வேளாண் துறை', type: 'Government Partner', typeTa: 'அரசு பங்காளர்', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { name: 'Organic India Network', nameTa: 'இயற்கை இந்தியா நெட்வொர்க்', type: 'Certification Body', typeTa: 'சான்றிதழ் அமைப்பு', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        { name: 'BlueDart Logistics', nameTa: 'ப்ளூடார்ட் லாஜிஸ்டிக்ஸ்', type: 'Logistics Partner', typeTa: 'தளவாட பங்காளர்', icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { name: 'Global Spice Exchange', nameTa: 'உலக மசாலா பரிமாற்றம்', type: 'Distribution Hub', typeTa: 'விநியோக மையம்', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { name: 'EU Organic Collective', nameTa: 'EU இயற்கை கூட்டமைப்பு', type: 'Export Alliance', typeTa: 'ஏற்றுமதி கூட்டணி', icon: BadgeCheck, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
        { name: 'India Agri Export Board', nameTa: 'இந்திய வேளாண் ஏற்றுமதி வாரியம்', type: 'Export Board', typeTa: 'ஏற்றுமதி வாரியம்', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    ]

    const productEmojis = ['🫑', '💚', '🍌', '🌳']

    return (
        <section
            ref={sectionRef}
            className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 transition-colors"
            data-testid="business-growth-section"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ─────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold uppercase tracking-widest mb-4">
                        <BarChart3 className="w-4 h-4" /> {t.badge}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.heading}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.subheading}</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto mt-6 rounded-full" />
                </motion.div>

                {/* ── Animated Metrics ──────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} isVisible={isVisible} language={lang} index={i} />
                    ))}
                </div>

                {/* ── Production Capacity ───────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 mb-20 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <Package className="w-8 h-8 text-green-200" />
                            <h3 className="text-2xl md:text-3xl font-bold">{t.productionHeading}</h3>
                        </div>
                        <p className="text-green-100 mb-8 max-w-xl">{t.productionDesc}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {t.products.map((p, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition">
                                    <div className="text-3xl mb-2">{productEmojis[i]}</div>
                                    <h4 className="font-bold">{p.label}</h4>
                                    <p className="text-sm text-green-100 mt-1">{p.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Supply Chain ──────────────────────────────────────── */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-3">
                            <Truck className="w-5 h-5" />
                            <span className="text-sm uppercase tracking-widest font-semibold">{t.supplyChainLabel}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t.supplyChainHeading}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t.supplyChainDesc}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                            {supplyChain.map((step, i) => (
                                <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-0">
                                    <ChainStep step={i + 1} icon={step.icon} title={step.title} titleTa={step.titleTa} desc={step.desc} descTa={step.descTa} isLast={i === supplyChain.length - 1} language={lang} />
                                    {i < supplyChain.length - 1 && (
                                        <div className="hidden md:flex items-start pt-5 px-1 text-green-300">
                                            <ArrowRight className="w-5 h-5 flex-shrink-0" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Certifications ────────────────────────────────────── */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-3">
                            <BadgeCheck className="w-5 h-5" />
                            <span className="text-sm uppercase tracking-widest font-semibold">{t.certLabel}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t.certHeading}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t.certDesc}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {certifications.map((cert, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition group"
                                data-testid={`certification-item-${cert.label.toLowerCase().replace(/[\s&()]+/g, '-')}`}
                            >
                                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <cert.icon className={`w-6 h-6 ${cert.iconColor}`} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {lang === 'ta' ? cert.labelTa : cert.label}
                                    </p>
                                    <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cert.badgeColor}`}>
                                        {lang === 'ta' ? cert.statusTa : cert.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Partners ──────────────────────────────────────────── */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-3">
                            <Users className="w-5 h-5" />
                            <span className="text-sm uppercase tracking-widest font-semibold">{t.networkLabel}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t.networkHeading}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t.networkDesc}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {partners.map((partner, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-dashed border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 flex flex-col items-center text-center gap-3 group hover:shadow-md"
                                data-testid={`partner-card-${partner.name.toLowerCase().replace(/[\s&().]+/g, '-')}`}
                            >
                                <div className={`w-14 h-14 ${partner.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <partner.icon className={`w-7 h-7 ${partner.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                                        {lang === 'ta' ? partner.nameTa : partner.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                        {lang === 'ta' ? partner.typeTa : partner.type}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4 italic">{t.partnerNote}</p>
                </div>

                {/* ── CTA ───────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <HandCoins className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.ctaHeading}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{t.ctaDesc}</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:gap-3"
                        data-testid="growth-cta-button"
                    >
                        {t.ctaBtn} <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

            </div>
        </section>
    )
}
