/**
 * One-time patch: set nameTa on all products that are missing it.
 * Run with:  npx tsx prisma/patch-tamil-names.ts
 */
import { prisma } from '../lib/prisma'

const tamils: Record<string, string> = {
    'organic-black-pepper': 'ஆர்கானிக் கருமிளகு',
    'mountain-banana': 'மலை வாழைப்பழம்',
    'fresh-mountain-lemons': 'மலை எலுமிச்சை',
    'premium-avocado': 'வெண்ணெய் பழம் (அவகேடோ)',
    'red-banana': 'செவ்வாழை',
    'organic-cardamom': 'ஏலக்காய் (பச்சை ஏலம்)',
    'arabica-coffee-plant': 'காபி செடி (அரேபிகா)',
    'alphonso-mango': 'மாம்பழம் (அல்போன்ஸோ)',
    'mountain-jackfruit': 'பலாப்பழம்',
    'silver-oak-timber': 'வெள்ளி ஓக் மரம்',
    'teak-timber': 'தேக்கு மரம்',
    'silk-cotton-tree': 'இலவம் பருத்தி மரம்',
}

async function main() {
    console.log('🌿 Patching Tamil product names...')
    let count = 0
    for (const [slug, nameTa] of Object.entries(tamils)) {
        const result = await prisma.product.updateMany({
            where: { slug },
            data: { nameTa },
        })
        if (result.count > 0) {
            console.log(`  ✅ ${slug} → ${nameTa}`)
            count++
        } else {
            console.log(`  ⚠️  Not found: ${slug}`)
        }
    }
    console.log(`\n✅ Patched ${count} products with Tamil names.`)
}

main()
    .catch(e => { console.error('❌', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
