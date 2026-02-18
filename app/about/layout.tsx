import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Our Heritage | The Lourdes Garden Story',
    description: 'A legacy of organic excellence since 2020. Cultivating nature\'s finest with passion and integrity in Tamil Nadu.',
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
