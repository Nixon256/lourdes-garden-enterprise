import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Connect with Us | Lourdes Garden Reach',
    description: 'Inquire about our mountain-grown organic products, wholesale opportunities, or global exports. We respond within 24 hours.',
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
