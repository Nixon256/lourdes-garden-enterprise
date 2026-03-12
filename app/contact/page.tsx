'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { useLanguageStore } from '@/lib/store/useLanguageStore'
import { useEffect, useState } from 'react'
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { trackEnquirySubmission, trackPhoneClick, trackEmailClick } from '@/lib/analytics'

const COUNTRY_CODES = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
]

const MAX_MESSAGE_CHARS = 500

// ── Shared field style helper ──────────────────────────────────────────────
const fieldCls = (hasError: boolean) =>
    `w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition text-sm ${hasError
        ? 'border-red-400 focus:ring-red-400/30'
        : 'border-gray-200 dark:border-gray-700 focus:ring-green-500/30 focus:border-green-500'
    }`

// ── Reusable field wrapper with label, optional hint, optional error ────────
function PremiumField({
    label,
    error,
    hint,
    children,
    testId,
}: {
    label: string
    error?: string
    hint?: React.ReactNode
    children: React.ReactNode
    testId?: string
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {label}
                </label>
                {hint && <span>{hint}</span>}
            </div>
            {children}
            {error && (
                <p
                    className="mt-1 text-xs text-red-500 flex items-center gap-1"
                    data-testid={testId ? `${testId}-error` : undefined}
                >
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    )
}


export default function ContactPage() {
    const { language } = useLanguageStore()
    const [isMounted, setIsMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [countryCode, setCountryCode] = useState('+91')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; phone?: string; subject?: string; message?: string }>({})

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
            successDesc: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
            closeForm: 'Close',
            phoneError: 'Please enter a valid 10-digit phone number.',
            messageError: `Message cannot exceed ${MAX_MESSAGE_CHARS} characters.`,
            charsLeft: 'characters remaining',
            phoneLabel: 'Phone Number',
            phonePlaceholderShort: 'Enter 10-digit number',
            sendAnother: 'Send Another Message',   // kept for TS safety
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
            closeForm: 'மூடு',
            phoneError: 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.',
            messageError: `செய்தி ${MAX_MESSAGE_CHARS} எழுத்துகளுக்கு மேல் இருக்க கூடாது.`,
            charsLeft: 'எழுத்துகள் மீதம்',
            phoneLabel: 'தொலைபேசி எண்',
            phonePlaceholderShort: '10 இலக்க எண் உள்ளிடவும்',
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

        // — Full custom validation (no browser popups)
        const digitsOnly = formData.phone.replace(/\D/g, '')
        const errors: { name?: string; email?: string; phone?: string; subject?: string; message?: string } = {}
        if (!formData.name.trim()) errors.name = language === 'ta' ? 'பெயர் தேவை' : 'Full name is required'
        if (!formData.email.trim()) errors.email = language === 'ta' ? 'மின்னஞ்சல் தேவை' : 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = language === 'ta' ? 'சரியான மின்னஞ்சல் உள்ளிடுங்கள்' : 'Enter a valid email'
        if (!formData.phone || !/^\d{10}$/.test(digitsOnly)) {
            errors.phone = content.phoneError
        }
        if (!formData.subject) errors.subject = language === 'ta' ? 'பொருள் தேர்வு தேவை' : 'Please select a subject'
        if (!formData.message.trim()) errors.message = language === 'ta' ? 'செய்தி தேவை' : 'Message is required'
        else if (formData.message.length > MAX_MESSAGE_CHARS) errors.message = content.messageError
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }
        setFormErrors({})
        setIsSubmitting(true)

        try {
            const fullPhone = formData.phone ? `${countryCode} ${formData.phone}` : ''
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, phone: fullPhone }),
            })

            const data = await res.json()

            if (res.ok) {
                trackEnquirySubmission('contact_page')
                setSubmitted(true)
                toast.success(content.success)
                setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
                setCountryCode('+91')
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
        const { name, value } = e.target
        // Enforce message char limit
        if (name === 'message' && value.length > MAX_MESSAGE_CHARS) return
        // For phone: strip everything that is not a digit, cap at 10
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
            setFormData((prev) => ({ ...prev, phone: digitsOnly }))
            if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }))
            return
        }
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear relevant error on change
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const messageCharsLeft = MAX_MESSAGE_CHARS - formData.message.length
    const messageNearLimit = messageCharsLeft <= 50
    const messageAtLimit = messageCharsLeft === 0

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

                {/* ════════════════════════════════════════
                     PREMIUM SPLIT-PANEL CONTACT FORM
                    ════════════════════════════════════════ */}
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-green-900/10 border border-green-100 dark:border-green-900/20 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-5">

                        {/* ── Left branded panel ── */}
                        <div className="lg:col-span-2 relative bg-gradient-to-br from-green-800 via-emerald-900 to-green-950 p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[480px]">
                            {/* decorative blobs */}
                            <div className="absolute -top-16 -left-16 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-green-300 text-xs font-semibold tracking-widest uppercase border border-white/10 mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                                    {language === 'ta' ? 'தொடர்பு கொள்ள' : 'Get in Touch'}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                                    {content.formTitle}
                                </h2>
                                <p className="text-green-100/60 text-sm leading-relaxed">
                                    {language === 'ta'
                                        ? 'உங்கள் கேள்விகளுக்கு 24 மணி நேரத்திற்குள் பதில் அளிப்போம்.'
                                        : 'We respond to every enquiry within 24 hours — guaranteed.'}
                                </p>
                            </div>

                            {/* contact detail strips — clickable */}
                            <div className="relative z-10 space-y-3 mt-10">
                                {[
                                    {
                                        icon: <MapPin className="w-4 h-4" />,
                                        val: "LOURDE'S GARDEN",
                                        href: 'https://maps.app.goo.gl/V6dsG6TcT7jjnBkR9',
                                        target: '_blank',
                                    },
                                    {
                                        icon: <Mail className="w-4 h-4" />,
                                        val: 'lourdesgarden.odc@gmail.com',
                                        href: 'mailto:lourdesgarden.odc@gmail.com',
                                        onClick: () => trackEmailClick('contact_page'),
                                    },
                                    {
                                        icon: <Phone className="w-4 h-4" />,
                                        val: '+91 96264 94555',
                                        href: 'tel:+919626494555',
                                        onClick: () => trackPhoneClick('contact_page'),
                                    },
                                    {
                                        icon: <Clock className="w-4 h-4" />,
                                        val: content.hoursValue,
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/15 flex items-center justify-center text-green-300 flex-shrink-0 transition">
                                            {item.icon}
                                        </div>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target={item.target}
                                                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                                                onClick={item.onClick}
                                                className="text-green-100/75 text-xs leading-snug hover:text-white hover:underline transition-colors"
                                                data-testid={`contact-link-${item.val.toLowerCase().replace(/['\s,]+/g, '-')}`}
                                            >
                                                {item.val}
                                            </a>
                                        ) : (
                                            <span
                                                className="text-green-100/75 text-xs leading-snug"
                                                data-testid={`contact-info-${item.val.toLowerCase().replace(/['\s,]+/g, '-')}`}
                                            >
                                                {item.val}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* decorative leaf */}
                            <div className="relative z-10 mt-8 opacity-20 text-6xl select-none leading-none">🌿</div>
                        </div>

                        {/* ── Right form panel ── */}
                        <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-8 lg:p-10">
                            {submitted ? (
                                /* ── Premium Success State ── */
                                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                    <div className="relative inline-flex mb-6">
                                        <div className="absolute inset-0 bg-green-400/25 rounded-full blur-2xl animate-pulse scale-150" />
                                        <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{content.success}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs leading-relaxed mb-8">{content.successDesc}</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition font-semibold text-sm border border-gray-200 dark:border-gray-700"
                                        data-testid="contact-close-button"
                                    >
                                        <X className="w-4 h-4" />
                                        {content.closeForm}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate className="space-y-5" data-testid="contact-form">

                                    {/* Row 1: Name + Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <PremiumField label={`${content.name} *`} error={formErrors.name} testId="contact-name">
                                            <input
                                                type="text"
                                                name="name"
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder={content.namePlaceholder}
                                                className={fieldCls(!!formErrors.name)}
                                                data-testid="contact-name-input"
                                            />
                                        </PremiumField>
                                        <PremiumField label={`${content.email} *`} error={formErrors.email} testId="contact-email">
                                            <input
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={content.emailPlaceholder}
                                                className={fieldCls(!!formErrors.email)}
                                                data-testid="contact-email-input"
                                            />
                                        </PremiumField>
                                    </div>

                                    {/* Row 2: Phone + Subject */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Phone */}
                                        <PremiumField
                                            label={`${content.phoneLabel} *`}
                                            error={formErrors.phone}
                                            testId="contact-phone"
                                            hint={
                                                <span
                                                    className={`tabular-nums font-medium transition-colors text-xs ${formData.phone.length === 10 ? 'text-green-500' : 'text-gray-400'}`}
                                                    data-testid="contact-phone-counter"
                                                >
                                                    {formData.phone.length}/10
                                                </span>
                                            }
                                        >
                                            <div className={`flex rounded-xl overflow-hidden border transition-all ${formErrors.phone ? 'border-red-400 ring-2 ring-red-200 dark:ring-red-900' : 'border-gray-200 dark:border-gray-700 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20'} bg-gray-50 dark:bg-gray-800`}>
                                                <div className="relative flex-shrink-0">
                                                    <select
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                        aria-label="Country code"
                                                        className="appearance-none h-full pl-3 pr-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold border-r border-gray-200 dark:border-gray-700 focus:outline-none cursor-pointer"
                                                        data-testid="contact-country-code-select"
                                                    >
                                                        {COUNTRY_CODES.map((c) => (
                                                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                        const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
                                                        if (allowed.includes(e.key)) return
                                                        if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return
                                                        if (!/^\d$/.test(e.key)) e.preventDefault()
                                                    }}
                                                    placeholder={content.phonePlaceholderShort}
                                                    maxLength={10}
                                                    inputMode="numeric"
                                                    className="flex-1 px-3 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none tracking-widest font-mono"
                                                    data-testid="contact-phone-input"
                                                />
                                            </div>
                                        </PremiumField>

                                        {/* Subject */}
                                        <PremiumField label={`${content.subject} *`} error={formErrors.subject} testId="contact-subject">
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className={fieldCls(!!formErrors.subject)}
                                                data-testid="contact-subject-select"
                                            >
                                                <option value="" disabled>
                                                    {language === 'ta' ? '— ஒன்றை தேர்ந்தெடுக்கவும் —' : '— Select a subject —'}
                                                </option>
                                                {content.subjects.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </PremiumField>
                                    </div>

                                    {/* Message */}
                                    <PremiumField
                                        label={`${content.message} *`}
                                        error={formErrors.message}
                                        testId="contact-message"
                                        hint={
                                            <span
                                                className={`tabular-nums font-semibold text-xs transition-colors ${messageAtLimit ? 'text-red-500' : messageNearLimit ? 'text-amber-500' : 'text-gray-400'}`}
                                                data-testid="contact-message-counter"
                                            >
                                                {messageCharsLeft}/{MAX_MESSAGE_CHARS}
                                            </span>
                                        }
                                    >
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder={content.messagePlaceholder}
                                            className={`${fieldCls(!!formErrors.message || messageAtLimit)} resize-none`}
                                            data-testid="contact-message-textarea"
                                        />
                                        <div className="mt-1.5 h-0.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${messageAtLimit ? 'bg-red-500' : messageNearLimit ? 'bg-amber-400' : 'bg-green-500'}`}
                                                style={{ width: `${((MAX_MESSAGE_CHARS - messageCharsLeft) / MAX_MESSAGE_CHARS) * 100}%` }}
                                            />
                                        </div>
                                    </PremiumField>

                                    {/* Submit */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || messageAtLimit}
                                            className="w-full relative group overflow-hidden bg-gradient-to-br from-green-500 to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                                            data-testid="contact-submit-button"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {content.sending}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    {content.send}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-center text-xs text-gray-400 dark:text-gray-600">
                                        {language === 'ta' ? '* அனைத்து புலங்களும் கட்டாயமானவை' : '* All starred fields are required'}
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

            </section >

            {/* Route Map Section */}
            < section className="bg-white dark:bg-black py-20 transition-colors" >
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
            </section >

            {/* Map Section */}
            < section className="bg-gray-50 dark:bg-gray-900/50 py-16 transition-colors" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">{content.mapTitle}</h2>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1004660.6497522809!2d77.1363475!3d10.3853373!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9e3d7561436d9%3A0x6de6881dd6726af8!2sLOURDE'S%20GARDEN!5e0!3m2!1sen!2sin!4v1773354408978!5m2!1sen!2sin"
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
            </section >

            <Footer />
        </div >
    )
}
