import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Organic Agriculture Products | Export Quality | Lourdes Garden',
    description: 'Buy wholesale organic black pepper, green cardamom, mountain bananas, and teak plantation products from Tamil Nadu. Export-certified, B2B bulk pricing available.',
    openGraph: {
        title: 'Organic Export Products | Lourdes Garden - Tamil Nadu',
        description: 'Buy wholesale organic black pepper, green cardamom, mountain bananas, and teak plantation products from Tamil Nadu. Export-certified, B2B bulk pricing available.',
        images: ['/images/hero.png'],
    },
    keywords: ['organic black pepper wholesale', 'green cardamom export India', 'mountain banana supplier', 'bulk spice exporter Tamil Nadu', 'B2B organic agriculture'],
}

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
