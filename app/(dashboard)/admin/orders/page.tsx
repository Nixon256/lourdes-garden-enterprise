import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { ArrowLeft, ShoppingBag, Wrench } from 'lucide-react'
import Header from '@/components/layout/Header'

export default async function OrdersPage() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN')) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Orders Management Coming Soon!</h2>
                    <p className="text-gray-600 mb-6">
                        The order management system is currently being built. This will allow you to:
                    </p>
                    <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
                        <li className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-600">✓</span>
                            View all customer orders
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-600">✓</span>
                            Update order status
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-600">✓</span>
                            Print invoices and packing slips
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-600">✓</span>
                            Track shipments
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <span className="text-purple-600">✓</span>
                            Manage refunds
                        </li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                        <p className="text-sm text-blue-900">
                            <strong>Current Status:</strong> No orders yet. Once customers start placing orders through the e-commerce system, they will appear here.
                        </p>
                    </div>
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
