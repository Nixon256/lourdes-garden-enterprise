'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState } from 'react'

export default function PrivacyPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            title: 'Privacy Policy',
            subtitle: 'Last updated: February 18, 2026',
            introduction: 'Welcome to Lourdes Garden. We value your privacy and are committed to protecting your personal data.',
            sections: [
                {
                    title: '1. Information We Collect',
                    content: 'We collect information you provide directly to us when you fill out a contact form, register for an account, or make a purchase. This may include your name, email address, phone number, and mailing address.'
                },
                {
                    title: '2. How We Use Your Information',
                    content: 'We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your orders or inquiries.'
                },
                {
                    title: '3. Data Security',
                    content: 'We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.'
                }
            ]
        },
        ta: {
            title: 'தனியுரிமைக் கொள்கை',
            subtitle: 'கடைசியாக புதுப்பிக்கப்பட்டது: பிப்ரவரி 18, 2026',
            introduction: 'லூர்து கார்டனுக்கு உங்களை வரவேற்கிறோம். உங்கள் தனியுரிமையை நாங்கள் மதிக்கிறோம் மற்றும் உங்கள் தனிப்பட்ட தரவைப் பாதுகாக்க உறுதிபூண்டுள்ளோம்.',
            sections: [
                {
                    title: '1. நாங்கள் சேகரிக்கும் தகவல்',
                    content: 'நீங்கள் ஒரு தொடர்பு படிவத்தை பூர்த்தி செய்யும் போது, ​​கணக்கில் பதிவு செய்யும் போது அல்லது வாங்கும் போது நீங்கள் நேரடியாக எங்களுக்கு வழங்கும் தகவல்களை நாங்கள் சேகரிக்கிறோம். இதில் உங்கள் பெயர், மின்னஞ்சல் முகவரி, தொலைபேசி எண் மற்றும் அஞ்சல் முகவரி ஆகியவை அடங்கும்.'
                },
                {
                    title: '2. உங்கள் தகவலை நாங்கள் எவ்வாறு பயன்படுத்துகிறோம்',
                    content: 'எங்கள் சேவைகளை வழங்க, பராமரிக்க மற்றும் மேம்படுத்த, பரிவர்த்தனைகளைச் செயல்படுத்த மற்றும் உங்கள் ஆர்டர்கள் அல்லது விசாரணைகள் குறித்து உங்களுடன் தொடர்பு கொள்ள நாங்கள் சேகரிக்கும் தகவலைப் பயன்படுத்துகிறோம்.'
                },
                {
                    title: '3. தரவு பாதுகாப்பு',
                    content: 'உங்கள் தனிப்பட்ட தகவலின் அங்கீகரிக்கப்படாத அணுகல், மாற்றம், வெளிப்படுத்துதல் அல்லது அழித்தல் ஆகியவற்றிலிருந்து பாதுகாக்க பொருத்தமான பாதுகாப்பு நடவடிக்கைகளை நாங்கள் செயல்படுத்துகிறோம்.'
                }
            ]
        }
    }

    const content = isMounted ? t[language] : t.en

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Header />

            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold arima-font mb-4 text-gray-900 dark:text-white">
                        {content.title}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-12">
                        {content.subtitle}
                    </p>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 italic">
                            {content.introduction}
                        </p>

                        {content.sections.map((section, idx) => (
                            <div key={idx} className="mb-10">
                                <h2 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4 font-serif">
                                    {section.title}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
