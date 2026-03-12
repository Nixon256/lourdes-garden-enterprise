import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Farm Gallery | Organic Mountain Agriculture | Lourdes Garden',
    description: 'Visual tour of Lourdes Garden organic farm in Tamil Nadu. See our black pepper vines, cardamom groves, mountain bananas, and teak plantation landscapes.',
    openGraph: {
        title: 'Farm Gallery | Lourdes Garden Organic Agriculture Tamil Nadu',
        description: 'Visual tour of Lourdes Garden organic farm in Tamil Nadu. See our black pepper vines, cardamom groves, mountain bananas, and teak plantation landscapes.',
        images: ['/images/hero.png'],
    },
    keywords: ['organic farm photos Tamil Nadu', 'spice plantation gallery', 'agriculture farm tour India', 'Lourdes Garden farm images'],
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
