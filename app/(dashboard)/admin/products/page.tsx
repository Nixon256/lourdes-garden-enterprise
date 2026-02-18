'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Package,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/layout/Header'

interface Product {
    id: string
    name: string
    sku: string
    basePrice: number
    retailPrice: number
    status: string
    isOrganic: boolean
    isFeatured: boolean
    primaryImage: string | null
    category: {
        name: string
    }
    inventory: {
        currentStock: number
    }[]
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [page, search])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search && { search }),
            })

            const res = await fetch(`/api/products?${params}`)
            const data = await res.json()

            if (res.ok) {
                setProducts(data.products)
                setTotal(data.pagination.total)
                setTotalPages(data.pagination.totalPages)
            } else {
                toast.error(data.error || 'Failed to load products')
            }
        } catch (error) {
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1) // Reset to first page on search
    }

    const handleDelete = (id: string) => {
        setProductToDelete(id)
    }

    const confirmDelete = async () => {
        if (!productToDelete) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/products/${productToDelete}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                toast.success('Product deleted successfully')
                fetchProducts()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to delete product')
            }
        } catch (error) {
            toast.error('Failed to delete product')
        } finally {
            setDeleting(false)
            setProductToDelete(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by product name or SKU..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Filter Button (placeholder for future) */}
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Results count */}
                    <div className="mt-3 text-sm text-gray-600">
                        Showing {products.length} of {total} products
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-600 mb-4">
                                {search ? 'Try adjusting your search' : 'Get started by adding your first product'}
                            </p>
                            <Link
                                href="/admin/products/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                SKU
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded overflow-hidden relative flex items-center justify-center">
                                                            {product.primaryImage ? (
                                                                <Image
                                                                    src={product.primaryImage}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-gray-500" />
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            <div className="text-xs text-gray-500 flex gap-2 mt-1">
                                                                {product.isOrganic && (
                                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                                                        Organic
                                                                    </span>
                                                                )}
                                                                {product.isFeatured && (
                                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.sku}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {product.category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ₹{product.retailPrice}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Base: ₹{product.basePrice}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.inventory[0]?.currentStock || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'ACTIVE'
                                                            ? 'bg-green-100 text-green-800'
                                                            : product.status === 'DRAFT'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-700 transition"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-700 transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {productToDelete && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center">
                                                <Trash2 className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                                                <p className="text-sm text-gray-600">This action cannot be undone</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-6">
                                            Are you sure you want to delete this product? It will be permanently removed from the catalog.
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setProductToDelete(null)}
                                                disabled={deleting}
                                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmDelete}
                                                disabled={deleting}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                                            >
                                                {deleting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-5 h-5" />
                                                        Delete
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Page {page} of {totalPages}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setPage(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                                disabled={page === totalPages}
                                                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
