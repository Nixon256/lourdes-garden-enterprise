import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Art of the Soil | Lourdes Garden Gallery',
    description: 'A visual journey through the soul of Lourdes Garden. 59+ heritage assets capturing our mountain farming legacy.',
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>{children}</section>
}
