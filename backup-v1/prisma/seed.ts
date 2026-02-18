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
        update: {},
        create: {
            sku: 'BP-001',
            name: 'Organic Black Pepper',
            slug: 'organic-black-pepper',
            type: ProductType.SPICE,
            categoryId: categories[1].id, // Spices
            descriptionEn: 'Premium quality organic black pepper from our farm. Rich in flavor and aroma, perfect for all your culinary needs. Grown without any chemical pesticides or fertilizers.',
            descriptionTa: 'எங்கள் பண்ணையிலிருந்து உயர்தர இயற்கை கருப்பு மிளகு. சுவை மற்றும் மணத்தில் நிறைந்தது.',
            shortDescEn: 'Aromatic and flavorful black pepper',
            basePrice: 800,
            retailPrice: 850,
            wholesalePrice: 700,
            exportPrice: 900,
            currency: 'INR',
            isOrganic: true,
            isExportGrade: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            isBestSeller: true,
            unit: 'kg',
            weight: 1,
            keywords: ['black pepper', 'spice', 'organic', 'export quality'],
            metaTitle: 'Organic Black Pepper - Export Quality | Lourdes Garden',
            metaDescription: 'Buy premium organic black pepper directly from our farm. Export grade quality, rich aroma, and authentic flavor.',
        },
    })
    products.push(blackPepper)

    // Product 2: Mountain Banana
    const banana = await prisma.product.upsert({
        where: { slug: 'mountain-banana' },
        update: {},
        create: {
            sku: 'BN-001',
            name: 'Mountain Banana (Nendran)',
            slug: 'mountain-banana',
            type: ProductType.FRUIT,
            categoryId: categories[0].id, // Fruits
            descriptionEn: 'Fresh mountain bananas (Nendran variety) grown in the hills. Rich in nutrients, perfect for cooking and eating raw. Premium quality with natural sweetness.',
            descriptionTa: 'மலை வாழைப்பழம் (நேந்திரம் வகை). இயற்கையான இனிப்புடன் ஊட்டச்சத்து நிறைந்தது.',
            shortDescEn: 'Fresh mountain bananas - Nendran variety',
            basePrice: 40,
            retailPrice: 45,
            wholesalePrice: 35,
            exportPrice: 50,
            currency: 'INR',
            isOrganic: true,
            isExportGrade: false,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            weight: 1,
            keywords: ['banana', 'nendran', 'fruit', 'organic', 'mountain'],
            metaTitle: 'Fresh Mountain Banana - Nendran Variety | Lourdes Garden',
            metaDescription: 'Buy fresh organic mountain bananas (Nendran) directly from our farm. Rich in nutrients and natural sweetness.',
        },
    })
    products.push(banana)

    // Product 3: Fresh Lemons
    const lemon = await prisma.product.upsert({
        where: { slug: 'fresh-mountain-lemons' },
        update: {},
        create: {
            sku: 'LM-001',
            name: 'Fresh Mountain Lemons',
            slug: 'fresh-mountain-lemons',
            type: ProductType.FRUIT,
            categoryId: categories[0].id, // Fruits
            descriptionEn: 'Juicy and tangy mountain lemons grown organically. Perfect for cooking, drinks, and health remedies. High vitamin C content and intense citrus flavor.',
            descriptionTa: 'இயற்கையாக வளர்க்கப்பட்ட சுவையான மலை எலுமிச்சை. வைட்டமின் சி நிறைந்தது.',
            shortDescEn: 'Tangy and juicy mountain lemons',
            basePrice: 60,
            retailPrice: 70,
            wholesalePrice: 50,
            exportPrice: 80,
            currency: 'INR',
            isOrganic: true,
            isExportGrade: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            unit: 'kg',
            weight: 1,
            keywords: ['lemon', 'citrus', 'organic', 'mountain', 'vitamin c'],
            metaTitle: 'Fresh Organic Mountain Lemons | Lourdes Garden',
            metaDescription: 'Buy fresh, juicy mountain lemons grown organically. High in vitamin C, perfect for all your culinary and health needs.',
        },
    })
    products.push(lemon)

    // Product 4: Avocado (NEW)
    const avocado = await prisma.product.upsert({
        where: { slug: 'premium-avocado' },
        update: {},
        create: {
            sku: 'AV-001',
            name: 'Premium Avocado',
            slug: 'premium-avocado',
            type: ProductType.FRUIT,
            categoryId: categories[0].id, // Fruits
            descriptionEn: 'Premium quality avocados grown organically in our farm. Rich in healthy fats, vitamins, and minerals. Perfect for salads, smoothies, and cooking.',
            descriptionTa: 'உயர்தர வெண்ணெய்பழம். ஆரோக்கியமான கொழுப்பு மற்றும் வைட்டமின்கள் நிறைந்தது.',
            shortDescEn: 'Creamy and nutritious avocados',
            basePrice: 150,
            retailPrice: 180,
            wholesalePrice: 130,
            exportPrice: 200,
            currency: 'INR',
            isOrganic: true,
            isExportGrade: true,
            status: ProductStatus.ACTIVE,
            isFeatured: true,
            isNewArrival: true,
            unit: 'piece',
            weight: 0.2,
            keywords: ['avocado', 'fruit', 'organic', 'healthy fats', 'superfood'],
            metaTitle: 'Premium Organic Avocados | Lourdes Garden',
            metaDescription: 'Buy premium organic avocados rich in healthy fats and nutrients. Perfect for a healthy lifestyle.',
        },
    })
    products.push(avocado)

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
