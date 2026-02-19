'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState } from 'react'
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
    })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const t = {
        en: {
            title: 'Contact Us',
            subtitle: 'We\'d love to hear from you. Get in touch with our team.',
            formTitle: 'Send us a Message',
            name: 'Full Name',
            namePlaceholder: 'Enter your name',
            email: 'Email Address',
            emailPlaceholder: 'your@email.com',
            phone: 'Phone Number',
            phonePlaceholder: '+91 XXXXX XXXXX',
            subject: 'Subject',
            subjects: ['General Inquiry', 'Product Inquiry', 'Wholesale / B2B', 'Export Inquiry', 'Feedback', 'Other'],
            message: 'Your Message',
            messagePlaceholder: 'Tell us how we can help you...',
            send: 'Send Message',
            sending: 'Sending...',
            success: 'Message Sent Successfully!',
            successDesc: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
            sendAnother: 'Send Another Message',
            visitUs: 'Visit Our Farm',
            address: 'SIRUVATU, Oddanchatram, Vadakadu, Tamil Nadu 624212, India',
            emailUs: 'Email Us',
            callUs: 'Call Us',
            hours: 'Business Hours',
            hoursValue: 'Mon - Sat: 8:00 AM - 6:00 PM',
            mapTitle: 'Find Us on the Map',
            routeTitle: 'Mountain Route Guide',
            routeSubtitle: 'A scenic 25.8km trek through the mountains of Tamil Nadu.',
            distance: 'Total Distance',
            estTime: 'Est. Travel Time',
            oddBusStand: 'Oddanchatram Bus Stand',
            oddBusStandDesc: 'The journey towards the hills begins here.',
            checkPost: 'Forest Check Post',
            checkPostDesc: 'Mountain entry point. (2.1km from Start)',
            bethelpuram: 'Bethelpuram (Take Left)',
            bethelpuramDesc: 'Crucial turn point. (16.7km from Check Post)',
            destination: 'Lourdes Garden',
            destinationDesc: 'Welcome to our sanctuary. (7km from Turn)',
        },
        ta: {
            title: 'தொடர்பு கொள்ள',
            subtitle: 'உங்களிடமிருந்து கேட்க விரும்புகிறோம். எங்கள் குழுவுடன் தொடர்பில் இருங்கள்.',
            formTitle: 'எங்களுக்கு ஒரு செய்தி அனுப்புங்கள்',
            name: 'முழு பெயர்',
            namePlaceholder: 'உங்கள் பெயரை உள்ளிடுங்கள்',
            email: 'மின்னஞ்சல் முகவரி',
            emailPlaceholder: 'your@email.com',
            phone: 'தொலைபேசி எண்',
            phonePlaceholder: '+91 XXXXX XXXXX',
            subject: 'பொருள்',
            subjects: ['பொது விசாரணை', 'தயாரிப்பு விசாரணை', 'மொத்த விற்பனை / B2B', 'ஏற்றுமதி விசாரணை', 'கருத்து', 'மற்றவை'],
            message: 'உங்கள் செய்தி',
            messagePlaceholder: 'நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும் என்று கூறுங்கள்...',
            send: 'செய்தி அனுப்பு',
            sending: 'அனுப்புகிறது...',
            success: 'செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!',
            successDesc: 'எங்களைத் தொடர்பு கொண்டதற்கு நன்றி. 24 மணி நேரத்திற்குள் உங்களுக்கு பதிலளிப்போம்.',
            sendAnother: 'மற்றொரு செய்தி அனுப்பு',
            visitUs: 'எங்கள் பண்ணைக்கு வாருங்கள்',
            address: 'சிறுவட்டு, ஒட்டன்சத்திரம், வடக்கடு, தமிழ்நாடு 624212, இந்தியா',
            emailUs: 'மின்னஞ்சல் அனுப்புங்கள்',
            callUs: 'அழைக்கவும்',
            hours: 'வணிக நேரம்',
            hoursValue: 'திங்கள் - சனி: காலை 8:00 - மாலை 6:00',
            mapTitle: 'வரைபடத்தில் எங்களைக் காணுங்கள்',
            routeTitle: 'மலைப் பாதை வழிகாட்டி',
            routeSubtitle: 'தமிழ்நாட்டின் மலைப்பகுதிகளில் 25.8 கிமீ அழகிய பயணம்.',
            distance: 'மொத்த தூரம்',
            estTime: 'மதிப்பிடப்பட்ட நேரம்',
            oddBusStand: 'ஒட்டன்சத்திரம் பேருந்து நிலையம்',
            oddBusStandDesc: 'மலைகளை நோக்கிய பயணம் இங்கே தொடங்குகிறது.',
            checkPost: 'வன சோதனைச் சாவடி',
            checkPostDesc: 'மலைப்பாதை நுழைவுப் புள்ளி. (தொடங்கிய இடத்திலிருந்து 2.1 கிமீ)',
            bethelpuram: 'பெத்தேல்புரம் (இடதுபுறம் திரும்பவும்)',
            bethelpuramDesc: 'முக்கியமான திருப்பம். (சோதனைச் சாவடியிலிருந்து 16.7 கிமீ)',
            destination: 'லூர்து கார்டன்',
            destinationDesc: 'எங்கள் சரணாலயத்திற்கு உங்களை வரவேற்கிறோம். (திருப்பத்திலிருந்து 7 கிமீ)',
        }
    }

    const content = isMounted ? t[language] : t.en

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                setSubmitted(true)
                toast.success(content.success)
                setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
            } else {
                toast.error(data.error || 'Something went wrong')
            }
        } catch (error) {
            toast.error('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="min-h-screen transition-colors duration-300 arima-font">
            <Header />

            {/* Hero Banner */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/hero.png"
                    alt="Contact Lourdes Garden"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 text-center text-white px-4">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium tracking-wide border border-white/20 mb-6 mx-auto">
                        {language === 'ta' ? 'எங்கள் தொடர்பில் இருங்கள்' : 'Stay Connected'}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl">
                        {content.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto opacity-90 drop-shadow-md italic">
                        {content.subtitle}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        {/* Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-green-600 dark:text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{content.visitUs}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{content.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{content.emailUs}</h3>
                                    <a href="mailto:lourdesgarden.odc@gmail.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        lourdesgarden.odc@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{content.callUs}</h3>
                                    <a href="tel:+919626494555" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                                        +91 96264 94555
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{content.hours}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{content.hoursValue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{content.success}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">{content.successDesc}</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                                    >
                                        {content.sendAnother}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{content.formTitle}</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {content.name} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder={content.namePlaceholder}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {content.email} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder={content.emailPlaceholder}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {content.phone}
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder={content.phonePlaceholder}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                                />
                                            </div>

                                            {/* Subject */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {content.subject} <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="subject"
                                                    required
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                                >
                                                    {content.subjects.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {content.message} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder={content.messagePlaceholder}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {content.sending}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    {content.send}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Route Map Section */}
            <section className="bg-white dark:bg-black py-20 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 text-sm font-medium tracking-wide border border-green-500/20 mb-6 mx-auto">
                            {language === 'ta' ? 'அழகிய மலைப் பாதை' : 'Scenic Mountain Route'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 italic">
                            {content.routeTitle}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            {content.routeSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Route Stats */}
                        <div className="space-y-12">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20">
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">{content.distance}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">~ 25.8 KM</p>
                                </div>
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{content.estTime}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">~ 45 MIN</p>
                                </div>
                            </div>

                            {/* Journey Timeline */}
                            <div className="relative space-y-8 pl-8 border-l-2 border-dashed border-green-300 dark:border-green-800">
                                {/* Step 1: Bus Stand */}
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-black shadow-lg" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{content.oddBusStand}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{content.oddBusStandDesc}</p>
                                    <p className="text-xs font-bold text-green-600 mt-1 uppercase tracking-tight">Start (0 KM)</p>
                                    <a href="https://maps.app.goo.gl/MLXzA3h9YZqT1Euj7" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" /> View on Maps
                                    </a>
                                </div>

                                {/* Step 2: Forest Check Post */}
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-black shadow-lg" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{content.checkPost}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{content.checkPostDesc}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-px w-8 bg-green-200 dark:bg-green-800" />
                                        <p className="text-xs font-bold text-green-600">2.1 KM</p>
                                    </div>
                                    <a href="https://maps.app.goo.gl/K1BZhTa1GB4W6HmLA" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" /> View Check Post
                                    </a>
                                </div>

                                {/* Step 3: Bethelpuram */}
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-amber-500 rounded-full border-4 border-white dark:border-black shadow-lg animate-pulse" />
                                    <h4 className="font-bold text-amber-600 dark:text-amber-500 mb-1">{content.bethelpuram}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{content.bethelpuramDesc}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-px w-8 bg-green-200 dark:bg-green-800" />
                                        <p className="text-xs font-bold text-green-600">18.8 KM (+16.7 KM)</p>
                                    </div>
                                    <div className="flex gap-4 mt-2">
                                        <a href="https://maps.app.goo.gl/W88r9fzLDdmYQKJa8" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Bus Stop
                                        </a>
                                        <a href="https://maps.app.goo.gl/6hqSxWpVuJZHjcNNA" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 font-bold hover:underline bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded leading-none flex items-center gap-1">
                                            Take Left Here
                                        </a>
                                    </div>
                                </div>

                                {/* Step 4: Destination */}
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-green-600 rounded-full border-4 border-white dark:border-black shadow-lg" />
                                    <div className="p-4 bg-green-600/10 rounded-xl border border-green-600/20">
                                        <h4 className="font-bold text-green-600 dark:text-green-500 mb-1">{content.destination}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{content.destinationDesc}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-px w-8 bg-green-200 dark:bg-green-800" />
                                            <p className="text-xs font-bold text-green-600">25.8 KM (ARRIVED)</p>
                                        </div>
                                        <a href="https://maps.app.goo.gl/4uF7AXKVr6CR6LPr8" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-2 inline-block">
                                            View Final Destination
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Illustrative Map Visual */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl p-2">
                                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-inner">
                                    <Image
                                        src="/images/route-map.png"
                                        alt="Lourdes Garden Route Map"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay to match premium aesthetic */}
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500 italic">
                                    {language === 'ta' ? '* சிறந்த வழிகாட்டுதலுக்கு இந்த வரைபடத்தைப் பார்க்கவும்' : '* Refer to this map for the best scenic route guidance'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="bg-gray-50 dark:bg-gray-900/50 py-16 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">{content.mapTitle}</h2>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.0!2d77.7!3d10.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00!2sOddanchatram!5e0!3m2!1sen!2sin!4v1"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        />
                    </div>
                    <div className="text-center mt-4">
                        <a
                            href="https://maps.app.goo.gl/Nguc15jjMuFTA5ALA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 hover:underline font-medium"
                        >
                            <MapPin className="w-4 h-4" />
                            {language === 'ta' ? 'Google வரைபடத்தில் திற' : 'Open in Google Maps'}
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
