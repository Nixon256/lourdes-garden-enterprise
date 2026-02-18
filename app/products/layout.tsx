import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Heritage Harvest | Lourdes Garden Editorial',
    description: 'Explore the cinematic stories behind our premium mountain-grown organic products. A silent dialogue between soil and soul.',
}

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
