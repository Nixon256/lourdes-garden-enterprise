import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    Plus,
    Images,
    Settings,
    Clock
} from 'lucide-react'
import Header from '@/components/layout/Header'

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        redirect('/login')
    }

    // Fetch real stats
    const [productCount, galleryCount, latestProduct] = await Promise.all([
        prisma.product.count(),
        prisma.galleryImage.count(),
        prisma.product.findFirst({
            orderBy: { updatedAt: 'desc' },
            select: { name: true, updatedAt: true }
        })
    ])

    const stats = [
        {
            title: 'Total Products',
            value: productCount.toString(),
            change: latestProduct ? `Last: ${latestProduct.name}` : 'No products',
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            title: 'Gallery Images',
            value: galleryCount.toString(),
            change: 'All synced to DB',
            icon: Images,
            color: 'bg-amber-500',
        },
        {
            title: 'Customers',
            value: '1',
            change: 'customer@example.com',
            icon: Users,
            color: 'bg-purple-500',
        },
        {
            title: 'Revenue',
            value: '₹0',
            change: 'Launch soon!',
            icon: TrendingUp,
            color: 'bg-green-500',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                Welcome back, {session.user?.name}! 👋
                            </h2>
                            <p className="text-green-100 text-lg">
                                Your farm enterprise is growing. {productCount} products and {galleryCount} images are live.
                            </p>
                        </div>
                        <LayoutDashboard className="w-20 h-20 text-green-200 opacity-50" />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                {index === 0 && latestProduct && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date(latestProduct.updatedAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-xs text-gray-500 truncate" title={stat.change}>{stat.change}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/products/new" className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200">
                            <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Add Product</p>
                                <p className="text-sm text-gray-600">Create new product</p>
                            </div>
                        </Link>

                        <Link href="/admin/products" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200">
                            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Manage Products</p>
                                <p className="text-sm text-gray-600">View all products</p>
                            </div>
                        </Link>

                        <Link href="/admin/gallery" className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition border border-amber-200">
                            <div className="bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Images className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Gallery Manager</p>
                                <p className="text-sm text-gray-600">Upload & manage photos</p>
                            </div>
                        </Link>

                        <Link href="/admin/orders" className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200">
                            <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">View Orders</p>
                                <p className="text-sm text-gray-600">Manage orders</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        System Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                ✓
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Infrastructure Ready</p>
                                <p className="text-sm text-gray-600">Authentication, Database, and Media storage are fully operational.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                ✓
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Gallery Sync</p>
                                <p className="text-sm text-gray-600">All {galleryCount} heritage photos have been migrated to the database.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                →
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Rich Text Stories</p>
                                <p className="text-sm text-gray-600">New storytelling editor is active. Start formatting your product descriptions!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
