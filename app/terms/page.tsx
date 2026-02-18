'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState } from 'react'

export default function TermsPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            title: 'Terms of Service',
            subtitle: 'Last updated: February 18, 2026',
            introduction: 'By accessing or using the Lourdes Garden website, you agree to comply with and be bound by these Terms of Service.',
            sections: [
                {
                    title: '1. Use of Services',
                    content: 'You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this site by any third party.'
                },
                {
                    title: '2. Product Information',
                    content: 'We strive to provide accurate information about our products, including pricing and availability. However, we do not warrant that product descriptions or other content are error-free.'
                },
                {
                    title: '3. Intellectual Property',
                    content: 'All content on this site, including text, graphics, logos, and images, is the property of Lourdes Garden and is protected by international copyright laws.'
                }
            ]
        },
        ta: {
            title: 'சேவை விதிமுறைகள்',
            subtitle: 'கடைசியாக புதுப்பிக்கப்பட்டது: பிப்ரவரி 18, 2026',
            introduction: 'லூர்து கார்டன் வலைதளத்தை அணுகுவதன் மூலம் அல்லது பயன்படுத்துவதன் மூலம், இந்த சேவை விதிமுறைகளுக்கு இணங்கவும் கட்டுப்படவும் ஒப்புக்கொள்கிறீர்கள்.',
            sections: [
                {
                    title: '1. சேவைகளைப் பயன்படுத்துதல்',
                    content: 'நீங்கள் எங்கள் சேவைகளை சட்டப்பூர்வ நோக்கங்களுக்காக மட்டுமே பயன்படுத்த ஒப்புக்கொள்கிறீர்கள் மற்றும் எந்தவொரு மூன்றாம் தரப்பினரின் உரிமைகளையும் மீறாத அல்லது இந்த தளத்தின் பயன்பாடு மற்றும் அனுபவத்தை கட்டுப்படுத்தாத அல்லது தடுக்காத வகையில் பயன்படுத்த வேண்டும்.'
                },
                {
                    title: '2. தயாரிப்பு தகவல்',
                    content: 'எங்கள் தயாரிப்புகள் பற்றிய துல்லியமான தகவல்களை வழங்க நாங்கள் முயற்சி செய்கிறோம். இருப்பினும், தயாரிப்பு விளக்கங்கள் அல்லது பிற உள்ளடக்கங்கள் பிழையற்றவை என்று நாங்கள் உத்தரவாதம் அளிக்கவில்லை.'
                },
                {
                    title: '3. அறிவுசார் சொத்து',
                    content: 'உரை, கிராபிக்ஸ், லோகோக்கள் மற்றும் படங்கள் உட்பட இந்த தளத்தில் உள்ள அனைத்து உள்ளடக்கங்களும் லூர்து கார்டனின் சொத்து மற்றும் சர்வதேச பதிப்புரிமை சட்டங்களால் பாதுகாக்கப்படுகிறது.'
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
