import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact & Wholesale Enquiry | Lourdes Garden Export',
    description: 'Contact Lourdes Garden for wholesale pricing, B2B export enquiries, and bulk organic spice orders from Tamil Nadu. WhatsApp & direct call available.',
    openGraph: {
        title: 'Wholesale Enquiry | Lourdes Garden Organic Export Tamil Nadu',
        description: 'Contact Lourdes Garden for wholesale pricing, B2B export enquiries, and bulk organic spice orders from Tamil Nadu. WhatsApp & direct call available.',
        images: ['/images/hero.png'],
    },
    keywords: ['organic spice wholesale enquiry', 'B2B farm export contact', 'bulk spice importer contact India', 'Lourdes Garden wholesale'],
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
