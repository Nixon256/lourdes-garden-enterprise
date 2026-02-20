'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Award, ShieldCheck, Heart } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState } from 'react'

export default function AboutPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            title: 'Our Story',
            subtitle: 'A legacy of organic excellence in the mountains of Tamil Nadu.',
            since: 'Since 2020',
            heading: "Cultivating Nature's Finest with Passion and Integrity",
            p1: "Nestled in the lush, misty mountains of Tamil Nadu, Lourdes Garden began with a simple vision: to bring the purest, most flavorful organic products from our soil to your table. What started as a small family passion for sustainable farming has evolved into an enterprise-grade platform dedicated to global agricultural excellence.",
            pillars: [
                { title: 'Purely Organic', desc: 'We believe in farming as nature intended. No synthetic pesticides, no chemical fertilizers—just rich volcanic soil, mountain water, and patient cultivation.' },
                { title: 'Global Standards', desc: 'Every product harvested at Lourdes Garden meets rigorous international export standards, ensuring that quality is never compromised.' },
                { title: 'Community Rooted', desc: 'Supporting local farmers and sustainable practices is at the heart of our operations. We grow together with our community.' },
                { title: 'Trackable Integrity', desc: 'From the first sprout to the final package, we maintain complete transparency in our supply chain for your peace of mind.' },
            ],
            quote: "Our farm is not just a business; it's a testament to the bounty of the mountains and our commitment to preserving nature's purity for generations to come.",
            p2: "Today, Lourdes Garden serves as a bridge between the traditional wisdom of mountain farming and the modern demands of the global market. Whether it's our aromatic black pepper, creamy avocados, or sweet mountain bananas, you can trust that every item is a gift from our home to yours.",
            cta: 'Ready to taste the mountain difference?',
            ctaBtn: 'Explore Our Harvest',
        },
        ta: {
            title: 'எங்கள் கதை',
            subtitle: 'தமிழ்நாட்டின் மலைப்பகுதிகளில் ஒரு ஆர்கானிக் மேன்மையின் மரபு.',
            since: '2020 முதல்',
            heading: 'இயற்கையின் சிறந்தவற்றை ஆர்வத்துடனும் நேர்மையுடனும் பயிரிடுதல்',
            p1: 'தமிழ்நாட்டின் பசுமையான, மூடுபனி மலைகளுக்கு இடையில் அமைந்துள்ள லூர்து கார்டன் ஒரு எளிய பார்வையுடன் தொடங்கியது: எமது மண்ணிலிருந்து தூய்மையான, சுவையான ஆர்கானிக் தயாரிப்புகளை உங்கள் மேசைக்குக் கொண்டு வருவது. நிலையான விவசாயத்தின் மீதான ஒரு சிறிய குடும்ப ஆர்வமாகத் தொடங்கியது இன்று உலகளாவிய விவசாயத் தரத்திற்கான ஒரு தளமாக வளர்ந்துள்ளது.',
            pillars: [
                { title: 'முழுமையான ஆர்கானிக்', desc: 'இயற்கை விரும்பியபடி விவசாயம் செய்வதை நாங்கள் நம்புகிறோம். செயற்கை பூச்சிக்கொல்லிகள் இல்லை, ரசாயன உரங்கள் இல்லை - வளமான எரிமலை மண், மலை நீர் மற்றும் பொறுமையான சாகுபடி மட்டுமே.' },
                { title: 'உலகளாவிய தரநிலைகள்', desc: 'லூர்து கார்டனில் அறுவடை செய்யப்படும் ஒவ்வொரு தயாரிப்பும் கடுமையான சர்வதேச ஏற்றுமதி தரநிலைகளை பூர்த்தி செய்கிறது, தரம் ஒருபோதும் சமரசம் செய்யப்படுவதில்லை.' },
                { title: 'சமூக வேரூன்றியது', desc: 'உள்ளூர் விவசாயிகள் மற்றும் நிலையான நடைமுறைகளை ஆதரிப்பது எங்கள் செயல்பாடுகளின் மையமாகும். எமது சமூகத்துடன் இணைந்து நாங்கள் வளர்கிறோம்.' },
                { title: 'கண்காணிக்கக்கூடிய நேர்மை', desc: 'முதல் முளைமுதல் இறுதி பேக்கேஜ் வரை, உங்கள் மன அமைதிக்காக எங்கள் விநியோகச் சங்கிலியில் முழுமையான வெளிப்படைத்தன்மையை பராமரிக்கிறோம்.' },
            ],
            quote: 'எங்கள் பண்ணை ஒரு வணிகம் மட்டுமல்ல; இது மலைகளின் செழுமைக்கும், இயற்கையின் தூய்மையை தலைமுறைகளாகப் பாதுகாப்பதற்கான எமது அர்ப்பணிப்பிற்கும் ஒரு சான்றாகும்.',
            p2: 'இன்று, லூர்து கார்டன் மலை விவசாயத்தின் பாரம்பரிய அறிவுக்கும் உலகளாவிய சந்தையின் நவீன தேவைகளுக்கும் இடையில் ஒரு பாலமாக செயல்படுகிறது. எமது நறுமணமிக்க மிளகு, கிரீமி வெண்ணெய் பழம் அல்லது இனிப்பு மலை வாழைப்பழங்கள் எதுவாக இருந்தாலும், ஒவ்வொரு பொருளும் எமது வீட்டிலிருந்து உங்களுக்கான பரிசு என்பதை நீங்கள் நம்பலாம்.',
            cta: 'மலையின் வித்தியாசத்தை சுவைக்க தயாரா?',
            ctaBtn: 'எங்கள் அறுவடையை ஆராயுங்கள்',
        }
    }

    const content = isMounted ? t[language] : t.en
    const IconMap = [Leaf, Award, Heart, ShieldCheck]

    return (
        <div className="min-h-screen transition-colors duration-300 arima-font">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden" data-testid="about-hero-section">
                <Image
                    src="/images/hero.png"
                    alt="Our Farm"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">{content.title}</h1>
                    <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
                        {content.subtitle}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="prose prose-lg prose-green mx-auto text-gray-600 dark:text-gray-400 font-sans">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-1 bg-green-600 dark:bg-green-500 rounded-full" />
                        <span className="text-green-600 dark:text-green-500 font-bold uppercase tracking-widest text-sm">{content.since}</span>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                        {content.heading}
                    </h2>

                    <p className="mb-8 text-xl leading-relaxed">
                        {content.p1}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
                        {content.pillars.map((pillar, idx) => {
                            const Icon = IconMap[idx]
                            const pillarTestId = pillar.title.toLowerCase().replace(/[\s&()]+/g, '-')
                            return (
                                <div
                                    key={idx}
                                    className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors"
                                    data-testid={`about-pillar-card-${pillarTestId}`}
                                >
                                    <Icon className="w-12 h-12 text-green-600 dark:text-green-500 mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{pillar.title}</h3>
                                    <p>{pillar.desc}</p>
                                </div>
                            )
                        })}
                    </div>

                    <blockquote className="border-l-4 border-green-600 dark:border-green-500 pl-8 py-4 italic text-2xl text-gray-700 dark:text-gray-300 font-light mb-12">
                        "{content.quote}"
                    </blockquote>

                    <p className="mb-12">
                        {content.p2}
                    </p>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="bg-green-600 dark:bg-green-700 py-20 text-center text-white transition-colors">
                <h2 className="text-4xl font-bold mb-8">{content.cta}</h2>
                <Link
                    href="/products"
                    className="inline-block px-10 py-5 bg-white dark:bg-gray-200 text-green-600 dark:text-green-800 rounded-full hover:bg-green-50 dark:hover:bg-white transition font-bold text-xl shadow-xl"
                    data-testid="about-cta-button"
                >
                    {content.ctaBtn}
                </Link>
            </section>

            <Footer />
        </div>
    )
}
