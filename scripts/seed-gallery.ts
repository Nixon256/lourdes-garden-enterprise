/**
 * One-time script to seed all existing static gallery images into the DB.
 * Run with: npx tsx scripts/seed-gallery.ts
 */
import { prisma } from '../lib/prisma'

const existingImages = [
    { src: '/images/gallery/1000048587.jpg', alt: 'Farm View', category: 'farm' },
    { src: '/images/gallery/1000048589.jpg', alt: 'Lush Greenery', category: 'nature' },
    { src: '/images/gallery/1000105006.jpg', alt: 'Fresh Harvest', category: 'harvest' },
    { src: '/images/gallery/1000105012.jpg', alt: 'Organic Produce', category: 'products' },
    { src: '/images/gallery/1000105027.jpg', alt: 'Farm Life', category: 'farm' },
    { src: '/images/gallery/1000105030.jpg', alt: "Nature's Bounty", category: 'nature' },
    { src: '/images/gallery/1000105033.jpg', alt: 'Sustainable Farming', category: 'farm' },
    { src: '/images/gallery/1000142656.jpg', alt: 'Quality Produce', category: 'products' },
    { src: '/images/gallery/1000142659.jpg', alt: 'Freshly Picked', category: 'harvest' },
    { src: '/images/gallery/20210203_091218.jpg', alt: 'Morning at the Farm', category: 'farm' },
    { src: '/images/gallery/20210203_110520.jpg', alt: 'Green Fields', category: 'nature' },
    { src: '/images/gallery/20210203_115318.jpg', alt: 'Harvest Time', category: 'harvest' },
    { src: '/images/gallery/20210203_115401.jpg', alt: 'Premium Quality', category: 'products' },
    { src: '/images/gallery/20210203_124619.jpg', alt: 'Farm Operations', category: 'farm' },
    { src: '/images/gallery/20210203_124650.jpg', alt: 'Natural Growth', category: 'nature' },
    { src: '/images/gallery/20210203_130308.jpg', alt: 'Bountiful Harvest', category: 'harvest' },
    { src: '/images/gallery/20210203_141557.jpg', alt: 'Product Showcase', category: 'products' },
    { src: '/images/gallery/20210203_141600.jpg', alt: 'Farm Landscape', category: 'farm' },
    { src: '/images/gallery/20210820_095720.jpg', alt: 'Seasonal Crops', category: 'nature' },
    { src: '/images/gallery/20220507_182730.jpg', alt: 'Sunset at Farm', category: 'farm' },
    { src: '/images/gallery/20220507_204801.jpg', alt: 'Evening Glow', category: 'nature' },
    { src: '/images/gallery/20220507_204810.jpg', alt: 'Night Farming', category: 'farm' },
    { src: '/images/gallery/20220508_064837.jpg', alt: 'Early Morning', category: 'nature' },
    { src: '/images/gallery/20220508_064850.jpg', alt: 'Fresh Dew', category: 'nature' },
    { src: '/images/gallery/20220508_105652.jpg', alt: 'Field Work', category: 'farm' },
    { src: '/images/gallery/20220508_105822.jpg', alt: 'Rich Soil', category: 'nature' },
    { src: '/images/gallery/20220508_105833.jpg', alt: 'Growing Strong', category: 'farm' },
    { src: '/images/gallery/20240127_120158.jpg', alt: 'Modern Techniques', category: 'farm' },
    { src: '/images/gallery/20240127_120159.jpg', alt: 'Sustainable Practices', category: 'nature' },
    { src: '/images/gallery/20240127_120759.jpg', alt: 'Yield Inspection', category: 'harvest' },
    { src: '/images/gallery/20240127_125220.jpg', alt: 'Sorting & Grading', category: 'products' },
    { src: '/images/gallery/20240127_143743.jpg', alt: 'Packing Process', category: 'products' },
    { src: '/images/gallery/20240127_143837.jpg', alt: 'Ready for Dispatch', category: 'products' },
    { src: '/images/gallery/20250517_091129.jpg', alt: 'Future Farming', category: 'farm' },
    { src: '/images/gallery/20250517_095529.jpg', alt: 'Innovation in Ag', category: 'nature' },
    { src: '/images/gallery/20250517_095546.jpg', alt: 'Precision Agriculture', category: 'farm' },
    { src: '/images/gallery/20250517_104416.jpg', alt: 'Healthy Crops', category: 'products' },
    { src: '/images/gallery/20250517_110356.jpg', alt: 'Abundant Yield', category: 'harvest' },
    { src: '/images/gallery/20250517_110413.jpg', alt: 'Quality Check', category: 'products' },
    { src: '/images/gallery/20250517_110507.jpg', alt: 'Farm Fresh', category: 'products' },
    { src: '/images/gallery/20250517_110510.jpg', alt: 'Organic Certification', category: 'nature' },
    { src: '/images/gallery/20250517_110512.jpg', alt: 'Export Quality', category: 'products' },
    { src: '/images/gallery/20250517_110807.jpg', alt: 'Global Standards', category: 'products' },
    { src: '/images/gallery/20250517_115040.jpg', alt: 'Team Work', category: 'farm' },
    { src: '/images/gallery/20250517_115059.jpg', alt: 'Community Support', category: 'nature' },
    { src: '/images/gallery/20250517_121917.jpg', alt: 'Harvest Celebration', category: 'harvest' },
    { src: '/images/gallery/20250517_131604.jpg', alt: 'Tradition & Tech', category: 'farm' },
    { src: '/images/gallery/20250517_135957.jpg', alt: 'Pure Nature', category: 'nature' },
    { src: '/images/gallery/20250517_154236.jpg', alt: 'Eco Friendly', category: 'nature' },
    { src: '/images/gallery/20250517_165531.jpg', alt: 'Green Revolution', category: 'farm' },
    { src: '/images/gallery/20250517_165543.jpg', alt: 'Sustainable Future', category: 'nature' },
    { src: '/images/gallery/20250517_165551.jpg', alt: 'Farm to Fork', category: 'products' },
    { src: '/images/gallery/20250517_171438.jpg', alt: 'Freshness Guaranteed', category: 'products' },
    { src: '/images/gallery/20251227_122551.jpg', alt: 'Winter Harvest', category: 'harvest' },
    { src: '/images/gallery/20251227_122559.jpg', alt: 'Cold Storage', category: 'farm' },
    { src: '/images/gallery/20251227_122616.jpg', alt: 'Logistics', category: 'farm' },
    { src: '/images/gallery/20251227_122620.jpg', alt: 'Global Shipping', category: 'products' },
    { src: '/images/gallery/20251227_122733.jpg', alt: 'Supply Chain', category: 'farm' },
    { src: '/images/gallery/20251227_152615.jpg', alt: 'Customer Satisfaction', category: 'products' },
]

async function main() {
    console.log('🌄 Seeding gallery images into DB...')

    // Get existing URLs already in DB to skip them
    const existing = await prisma.galleryImage.findMany({ select: { url: true } })
    const existingUrls = new Set(existing.map(e => e.url))

    const toInsert = existingImages.filter(img => !existingUrls.has(img.src))
    console.log(`Found ${existingUrls.size} already in DB. Inserting ${toInsert.length} new images...`)

    let count = existingUrls.size
    for (const img of toInsert) {
        await prisma.galleryImage.create({
            data: {
                url: img.src,
                alt: img.alt,
                category: img.category,
                order: count++,
            },
        })
    }

    const total = await prisma.galleryImage.count()
    console.log(`✅ Done! Total gallery images in DB: ${total}`)
    await prisma.$disconnect()
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})
