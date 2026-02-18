import { UserRole, UserStatus, ProductStatus, ProductType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function main() {
    console.log('🌱 Starting database seed...')

    // ===================================
    // 1. CREATE SUPER ADMIN
    // ===================================
    console.log('\n👤 Creating Super Admin...')

    const hashedPassword = await bcrypt.hash('Admin123!', 12)

    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@lourdesgarden.com' },
        update: {},
        create: {
            email: 'admin@lourdesgarden.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
            admin: {
                create: {
                    department: 'Management',
                },
            },
        },
    })

    console.log('✅ Super Admin created:', superAdmin.email)

    // ===================================
    // 2. CREATE CATEGORIES
    // ===================================
    console.log('\n📁 Creating categories...')

    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'fruits' },
            update: {},
            create: {
                name: 'Fruits',
                slug: 'fruits',
                nameEn: 'Fruits',
                nameTa: 'பழங்கள்',
                nameHi: 'फल',
                description: 'Fresh organic fruits from our farm',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'spices' },
            update: {},
            create: {
                name: 'Spices',
                slug: 'spices',
                nameEn: 'Spices',
                nameTa: 'மசாலா',
                nameHi: 'मसाले',
                description: 'Premium organic spices grown naturally',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'trees' },
            update: {},
            create: {
                name: 'Trees',
                slug: 'trees',
                nameEn: 'Trees',
                nameTa: 'மரங்கள்',
                nameHi: 'पेड़',
                description: 'Quality trees for agriculture and timber',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'value-added' },
            update: {},
            create: {
                name: 'Value-Added Products',
                slug: 'value-added',
                nameEn: 'Value-Added Products',
                nameTa: 'மதிப்பு கூட்டப்பட்ட பொருட்கள்',
                nameHi: 'मूल्य वर्धित उत्पाद',
                description: 'Processed and packaged premium products',
            },
        }),
    ])

    console.log('✅ Created', categories.length, 'categories')

    // ===================================
    // 3. CREATE PRODUCTS
    // ===================================
    console.log('\n🥬 Creating sample products...')

    const products = []

    // Product 1: Black Pepper
    const blackPepper = await prisma.product.upsert({
        where: { slug: 'organic-black-pepper' },
        update: {
            name: 'Organic Black Pepper',
            type: ProductType.SPICE,
            categoryId: categories[1].id,
            storyEn: 'Grown in the monsoon mists of Oddanchatram, our black pepper is sun-dried to perfection, capturing the untamed essence of the Western Ghats.',
            storyTa: 'ஒட்டன்சத்திரத்தின் மழைக்கால மூடுபனியில் வளர்ந்த எங்கள் கருப்பு மிளகு, மேற்கு தொடர்ச்சி மலையின் சாரத்தைக் கொண்டு சூரிய ஒளியில் உலர்த்தப்படுகிறது.',
            harvestingSeason: 'January - March',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Black Pepper.png',
        },
        create: {
            sku: 'BP-001',
            name: 'Organic Black Pepper',
            slug: 'organic-black-pepper',
            type: ProductType.SPICE,
            categoryId: categories[1].id,
            descriptionEn: 'Premium quality organic black pepper from our farm.',
            storyEn: 'Grown in the monsoon mists of Oddanchatram, our black pepper is sun-dried to perfection.',
            storyTa: 'ஒட்டன்சத்திரத்தின் மழைக்கால மூடுபனியில் வளர்ந்த எங்கள் கருப்பு மிளகு.',
            harvestingSeason: 'January - March',
            basePrice: 800,
            retailPrice: 850,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            primaryImage: '/images/pepper-main.jpg',
        },
    })
    products.push(blackPepper)

    // Product 2: Mountain Banana
    const mountainBanana = await prisma.product.upsert({
        where: { slug: 'mountain-banana' },
        update: {
            name: 'Mountain Banana',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            storyEn: 'Hand-nurtured in our high-altitude groves, these bananas carry the natural sweetness of the mountain sun and the richness of pure forest soil.',
            storyTa: 'எங்கள் மலைத்தோட்டங்களில் வளர்க்கப்படும் இந்த வாழைப்பழங்கள் மலை வெயிலின் இனிப்பையும் காடு மண்ணின் செழுமையையும் கொண்டுள்ளன.',
            harvestingSeason: 'Year-round',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Mountain Banana.png',
        },
        create: {
            sku: 'BN-001',
            name: 'Mountain Banana',
            slug: 'mountain-banana',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            descriptionEn: 'Fresh mountain bananas grown in the hills.',
            storyEn: 'Hand-nurtured in our high-altitude groves, these bananas carry the natural sweetness of the mountain sun.',
            storyTa: 'எங்கள் மலைத்தோட்டங்களில் வளர்க்கப்படும் இந்த வாழைப்பழங்கள் மலை வெயிலின் இனிப்பைக் கொண்டுள்ளன.',
            harvestingSeason: 'Year-round',
            basePrice: 40,
            retailPrice: 45,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            primaryImage: '/images/products/Mountain Banana.png',
        },
    })
    products.push(mountainBanana)

    // Product 3: Fresh Mountain Lemons
    const lemon = await prisma.product.upsert({
        where: { slug: 'fresh-mountain-lemons' },
        update: {
            name: 'Fresh Mountain Lemons',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            storyEn: 'A burst of mountain citrus, these radiant lemons are hand-picked at peak ripeness to bring refreshing zest to world-class kitchens.',
            storyTa: 'மலையின் எலுமிச்சை சுவை, இந்த கதிரியக்க எலுமிச்சைகள் உலகத் தரம் வாய்ந்த சமையலறைகளுக்கு புத்துணர்ச்சியூட்டும் சுவையை கொண்டு வர கையால் பறிக்கப்படுகின்றன.',
            harvestingSeason: 'August - October',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Lemon.png',
        },
        create: {
            sku: 'LM-001',
            name: 'Fresh Mountain Lemons',
            slug: 'fresh-mountain-lemons',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            descriptionEn: 'Juicy and tangy mountain lemons grown organically.',
            storyEn: 'A burst of mountain citrus, these radiant lemons are hand-picked at peak ripeness.',
            storyTa: 'மலையின் எலுமிச்சை சுவை, இந்த கதிரியக்க எலுமிச்சைகள் கையால் பறிக்கப்படுகின்றன.',
            harvestingSeason: 'August - October',
            basePrice: 60,
            retailPrice: 70,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            primaryImage: '/images/products/Lemon.png',
        },
    })
    products.push(lemon)

    // Product 4: Premium Avocado
    const avocado = await prisma.product.upsert({
        where: { slug: 'premium-avocado' },
        update: {
            name: 'Premium Avocado',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            storyEn: 'Velvety and rich, our cloud-forest avocados are cultivated with patience, offering a buttery texture prized by health-conscious gourmets.',
            storyTa: 'வெல்வெட்டி மற்றும் பணக்காரர், எங்கள் மேகக் காடு வெண்ணெய் பழங்கள் பொறுமையுடன் பயிரிடப்படுகின்றன.',
            harvestingSeason: 'June - August',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Avocado.png',
        },
        create: {
            sku: 'AV-001',
            name: 'Premium Avocado',
            slug: 'premium-avocado',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            descriptionEn: 'Premium quality organic avocados rich in healthy fats.',
            storyEn: 'Velvety and rich, our cloud-forest avocados are cultivated with patience.',
            storyTa: 'வெல்வெட்டி மற்றும் பணக்காரர், எங்கள் மேகக் காடு வெண்ணெய் பழங்கள்.',
            harvestingSeason: 'June - August',
            basePrice: 150,
            retailPrice: 180,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'piece',
            primaryImage: '/images/products/Avocado.png',
        },
    })
    products.push(avocado)

    // Product 5: Red Banana
    const redBanana = await prisma.product.upsert({
        where: { slug: 'red-banana' },
        update: {
            name: 'Red Banana',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            storyEn: 'Rare and revitalizing, our Red Bananas are prized for their creamy texture and hint of raspberry-like sweetness.',
            storyTa: 'அரிதான மற்றும் புத்துயிர் அளிக்கும் எங்கள் செவ்வாழை அதன் கிரீமி அமைப்பு மற்றும் இனிப்புக்காகப் போற்றப்படுகிறது.',
            harvestingSeason: 'Year-round',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Red Banana.png',
        },
        create: {
            sku: 'RB-001',
            name: 'Red Banana',
            slug: 'red-banana',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            descriptionEn: 'Nutrient-rich red bananas with a unique sweet flavor.',
            storyEn: 'Rare and revitalizing, our Red Bananas are prized for their creamy texture.',
            storyTa: 'அரிதான மற்றும் புத்துயிர் அளிக்கும் எங்கள் செவ்வாழை.',
            harvestingSeason: 'Year-round',
            basePrice: 60,
            retailPrice: 70,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            primaryImage: '/images/products/Red Banana.png',
        },
    })
    products.push(redBanana)

    // Product 6: Elaichi (Green Cardamom)
    const elaichi = await prisma.product.upsert({
        where: { slug: 'organic-cardamom' },
        update: {
            name: 'Elaichi (Green Cardamom)',
            type: ProductType.SPICE,
            categoryId: categories[1].id,
            storyEn: 'The Queen of Spices, harvested from the high estates of Vadakadu, filling the air with its divine and cool fragrance.',
            storyTa: 'மசாலாக்களின் ராணி, வத்தலக்குண்டு மலைகளில் இருந்து அறுவடை செய்யப்படுகிறது, இது ஒரு தெய்வீக மற்றும் குளிர்ந்த நறுமணத்தைக் கொண்டுள்ளது.',
            harvestingSeason: 'August - February',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Green cardamom.png',
        },
        create: {
            sku: 'EC-001',
            name: 'Elaichi (Green Cardamom)',
            slug: 'organic-cardamom',
            type: ProductType.SPICE,
            categoryId: categories[1].id,
            descriptionEn: 'Premium green cardamom pods with intense aroma.',
            storyEn: 'The Queen of Spices, harvested from the high estates of Vadakadu.',
            storyTa: 'மசாலாக்களின் ராணி, வத்தலக்குண்டு மலைகளில் இருந்து அறுவடை செய்யப்படுகிறது.',
            harvestingSeason: 'August - February',
            basePrice: 1200,
            retailPrice: 1500,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            primaryImage: '/images/products/Green cardamom.png',
        },
    })
    products.push(elaichi)

    // Product 7: Coffee Plant (Arabica)
    const coffeePlant = await prisma.product.upsert({
        where: { slug: 'arabica-coffee-plant' },
        update: {
            name: 'Coffee Plant (Arabica)',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            storyEn: 'Born in the shade of the Western Ghats, these saplings grow to produce the finest beans that have waked the world for centuries.',
            storyTa: 'மேற்கு தொடர்ச்சி மலையின் நிழலில் பிறந்த இந்த நாற்றுகள் பல நூற்றாண்டுகளாக உலகை விழிப்படையச் செய்த மிகச்சிறந்த காபி கொட்டைகளை உற்பத்தி செய்கின்றன.',
            harvestingSeason: 'Nursery Stage',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Coffee Bean.png',
        },
        create: {
            sku: 'CP-001',
            name: 'Coffee Plant (Arabica)',
            slug: 'arabica-coffee-plant',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            descriptionEn: 'High-quality Arabica coffee saplings for plantation.',
            storyEn: 'Born in the shade of the Western Ghats, these saplings grow to produce the finest beans.',
            storyTa: 'மேற்கு தொடர்ச்சி மலையின் நிழலில் பிறந்த இந்த நாற்றுகள் மிகச்சிறந்த காபி கொட்டைகளை உற்பத்தி செய்கின்றன.',
            harvestingSeason: 'Nursery Stage',
            basePrice: 150,
            retailPrice: 200,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'sapling',
            primaryImage: '/images/products/Coffee Bean.png',
        },
    })
    products.push(coffeePlant)

    // Product 8: Mango (Alphonso)
    const mango = await prisma.product.upsert({
        where: { slug: 'alphonso-mango' },
        update: {
            name: 'Mango (Alphonso)',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            storyEn: 'The King of Fruits, ripened naturally in our orchards, offering a burst of golden sunshine in every bite.',
            storyTa: 'பழங்களின் ராஜா, எங்கள் மாந்தோப்புகளில் இயற்கையாகப் பழுத்து, ஒவ்வொரு கடியிலும் தங்கச் சூரிய ஒளியைக் கொடுக்கிறது.',
            harvestingSeason: 'April - June',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Mango.png',
        },
        create: {
            sku: 'MG-001',
            name: 'Mango (Alphonso)',
            slug: 'alphonso-mango',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            descriptionEn: 'Delicious and sweet Alphonso mangoes from our farm.',
            storyEn: 'The King of Fruits, ripened naturally in our orchards.',
            storyTa: 'பழங்களின் ராஜா, எங்கள் மாந்தோப்புகளில் இயற்கையாகப் பழுக்கிறது.',
            harvestingSeason: 'April - June',
            basePrice: 500,
            retailPrice: 600,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'dozen',
            primaryImage: '/images/products/Mango.png',
        },
    })
    products.push(mango)

    // Product 9: Jack Fruit
    const jackFruit = await prisma.product.upsert({
        where: { slug: 'mountain-jackfruit' },
        update: {
            name: 'Jack Fruit',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            storyEn: "A giant's bounty, these massive fruits harbor golden bulbs of honey-like sweetness deep within their spiny skin.",
            storyTa: "ஒரு ராட்சதனின் வரம், இந்த பிரம்மாண்டமான பழங்கள் அவற்றின் முட்கள் நிறைந்த தோலுக்குள் தேன் போன்ற இனிமையான சுவையைக் கொண்டுள்ளன.",
            harvestingSeason: 'May - July',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Jackfruit.png',
        },
        create: {
            sku: 'JF-001',
            name: 'Jack Fruit',
            slug: 'mountain-jackfruit',
            type: ProductType.FRUIT,
            categoryId: categories[0].id,
            descriptionEn: 'Fresh and massive jackfruit with honey-sweet bulbs.',
            storyEn: "A giant's bounty, these massive fruits harbor golden bulbs of honey-like sweetness.",
            storyTa: "ஒரு ராட்சதனின் வரம், இந்த பிரம்மாண்டமான பழங்கள் தேன் போன்ற இனிமையான சுவையைக் கொண்டுள்ளன.",
            harvestingSeason: 'May - July',
            basePrice: 200,
            retailPrice: 300,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'fruit',
            primaryImage: '/images/products/Jackfruit.png',
        },
    })
    products.push(jackFruit)

    // Product 10: Silver Oak
    const silverOak = await prisma.product.upsert({
        where: { slug: 'silver-oak-timber' },
        update: {
            name: 'Silver Oak',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            storyEn: 'The elegant guardians of the hills, providing shade to coffee and timber for the future, standing tall and shimmering.',
            storyTa: 'மலைகளின் நேர்த்தியான பாதுகாவலர்கள், காபி தோட்டங்களுக்கு நிழல் தருகிறார்கள் மற்றும் எதிர்காலத்திற்கான மரங்களைத் தருகிறார்கள்.',
            harvestingSeason: 'Timber Maturity (10-15 years)',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Silver oak tree.png',
        },
        create: {
            sku: 'SO-001',
            name: 'Silver Oak',
            slug: 'silver-oak-timber',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            descriptionEn: 'Versatile silver oak trees for plantation and timber.',
            storyEn: 'The elegant guardians of the hills, providing shade to coffee.',
            storyTa: 'மலைகளின் நேர்த்தியான பாதுகாவலர்கள், எதிர்காலத்திற்கான மரங்களைத் தருகிறார்கள்.',
            harvestingSeason: 'Timber Maturity (10-15 years)',
            basePrice: 1000,
            retailPrice: 1200,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'log',
            primaryImage: '/images/products/Silver oak tree.png',
        },
    })
    products.push(silverOak)

    // Product 11: Teak Oak
    const teakOak = await prisma.product.upsert({
        where: { slug: 'teak-timber' },
        update: {
            name: 'Teak Oak',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            storyEn: 'The gold standard of timber, grown with patience and resilience to furnish homes with a legacy of strength.',
            storyTa: 'மரங்களின் தங்கத் தரம், வலிமையின் அடையாளமாக வீடுகளை அலங்கரிக்க பொறுமையுடன் வளர்க்கப்படுகிறது.',
            harvestingSeason: 'Maturity (20+ years)',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/teak tree.png',
        },
        create: {
            sku: 'TK-001',
            name: 'Teak Oak',
            slug: 'teak-timber',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            descriptionEn: 'Premium teak timber for long-lasting high-end uses.',
            storyEn: 'The gold standard of timber, grown with patience and resilience.',
            storyTa: 'மரங்களின் தங்கத் தரம், வலிமையின் அடையாளமாக வளர்க்கப்படுகிறது.',
            harvestingSeason: 'Maturity (20+ years)',
            basePrice: 5000,
            retailPrice: 6000,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'log',
            primaryImage: '/images/gallery/20251227_122616.jpg',
        },
    })
    products.push(teakOak)

    // Product 12: Silk Cotton Tree
    const silkCotton = await prisma.product.upsert({
        where: { slug: 'silk-cotton-tree' },
        update: {
            name: 'Silk Cotton Tree',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            storyEn: 'The silent giants that explode into vibrant red flowers, eventually giving away pure silk cotton to soothe the world.',
            storyTa: 'சிவப்பு மலர்களுடன் பூத்துக் குலுங்கும் இந்த ராட்சத மரங்கள், உலகிற்கு தூய இலவம் பஞ்சை வழங்குகின்றன.',
            harvestingSeason: 'Cotton Harvest (Annual)',
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            primaryImage: '/images/products/Silk cotton Tree.png',
        },
        create: {
            sku: 'SC-001',
            name: 'Silk Cotton Tree',
            slug: 'silk-cotton-tree',
            type: ProductType.TREE,
            categoryId: categories[2].id,
            descriptionEn: 'Majestic silk cotton trees providing natural fiber.',
            storyEn: 'The silent giants that explode into vibrant red flowers.',
            storyTa: 'இயற்கையான இலவம் பஞ்சை வழங்கும் ராட்சத மரங்கள் .',
            harvestingSeason: 'Cotton Harvest (Annual)',
            basePrice: 500,
            retailPrice: 700,
            isOrganic: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'tree',
            primaryImage: '/images/gallery/20210820_095720.jpg',
        },
    })
    products.push(silkCotton)

    // Remove Black Lemon
    await prisma.product.deleteMany({
        where: { slug: 'black-lemon' }
    })

    console.log('✅ Created', products.length, 'products')

    // ===================================
    // 4. CREATE INVENTORY
    // ===================================
    console.log('\n📦 Setting up inventory...')

    for (const product of products) {
        await prisma.inventory.create({
            data: {
                productId: product.id,
                currentStock: 1000,
                reservedStock: 0,
                availableStock: 1000,
                lowStockAlert: 100,
                reorderPoint: 200,
                warehouse: 'Main Warehouse',
                location: 'A-01',
            },
        })
    }

    console.log('✅ Inventory set up for all products')

    // ===================================
    // 5. DEMO CUSTOMER
    // ===================================
    console.log('\n👥 Creating demo customer...')

    const customerPassword = await bcrypt.hash('Customer123!', 12)

    const demoCustomer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            name: 'Demo Customer',
            password: customerPassword,
            role: UserRole.CUSTOMER,
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
            customer: {
                create: {
                    loyaltyPoints: 100,
                    totalSpent: 0,
                    totalOrders: 0,
                    preferredLanguage: 'en',
                    preferredCurrency: 'INR',
                    newsletter: true,
                    referralCode: 'DEMO2024',
                },
            },
        },
    })

    console.log('✅ Demo customer created:', demoCustomer.email)

    // ===================================
    // SUMMARY
    // ===================================
    console.log('\n========================================')
    console.log('🎉 DATABASE SEEDING COMPLETED!')
    console.log('========================================')
    console.log('\n📊 Summary:')
    console.log('  • Super Admin:', superAdmin.email, '| Password: Admin123!')
    console.log('  • Demo Customer:', demoCustomer.email, '| Password: Customer123!')
    console.log('  • Categories:', categories.length)
    console.log('  • Products:', products.length)
    console.log('\n🔐 Admin Login:')
    console.log('  URL: http://localhost:3000/login')
    console.log('  Email: admin@lourdesgarden.com')
    console.log('  Password: Admin123!')
    console.log('\n🚀 Next Steps:')
    console.log('  1. npm run dev')
    console.log('  2. Open http://localhost:3000/login')
    console.log('  3. Sign in with admin credentials')
    console.log('  4. Start building! 🌿')
    console.log('\n========================================\n')
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
