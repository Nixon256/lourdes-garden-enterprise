import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Our Story | Organic Mountain Farm Heritage | Lourdes Garden',
    description: 'A generational organic farm in the misty mountains of Tamil Nadu. Cultivating premium black pepper, cardamom, and bananas for global export since 2020.',
    openGraph: {
        title: 'Our Story | Lourdes Garden - Tamil Nadu Organic Heritage Farm',
        description: 'A generational organic farm in the misty mountains of Tamil Nadu. Cultivating premium black pepper, cardamom, and bananas for global export since 2020.',
        images: ['/images/hero.png'],
    },
    keywords: ['organic farm Tamil Nadu', 'heritage agriculture India', 'sustainable farming Western Ghats', 'organic spice farm India'],
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
