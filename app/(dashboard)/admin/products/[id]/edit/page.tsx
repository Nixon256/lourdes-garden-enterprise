'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import Header from '@/components/layout/Header'

interface Category {
    id: string
    name: string
}

interface Product {
    id: string
    name: string
    sku: string
    type: string
    categoryId: string
    shortDescEn: string | null
    descriptionEn: string | null
    descriptionTa: string | null
    descriptionHi: string | null
    basePrice: number
    retailPrice: number
    wholesalePrice: number | null
    exportPrice: number | null
    currency: string
    unit: string
    weight: number | null
    isOrganic: boolean
    isExportGrade: boolean
    isFeatured: boolean
    isBestSeller: boolean
    isNewArrival: boolean
    status: string
    primaryImage: string | null
    metaTitle: string | null
    metaDescription: string | null
    keywords: string[]
    inventory: {
        id: string
        currentStock: number
        lowStockAlert: number
        reorderPoint: number
        warehouse: string
        location: string
    }[]
}

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        type: 'FRUIT',
        categoryId: '',
        shortDescEn: '',
        descriptionEn: '',
        descriptionTa: '',
        descriptionHi: '',
        primaryImage: '',
        basePrice: '',
        retailPrice: '',
        wholesalePrice: '',
        exportPrice: '',
        currency: 'INR',
        currentStock: '',
        unit: 'kg',
        weight: '',
        lowStockAlert: '10',
        reorderPoint: '20',
        warehouse: 'Main Warehouse',
        location: 'A-01',
        isOrganic: false,
        isExportGrade: false,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: false,
        status: 'ACTIVE',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
    })

    useEffect(() => {
        fetchCategories()
        fetchProduct()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            const data = await res.json()
            if (res.ok) {
                setCategories(data.categories)
            }
        } catch (error) {
            toast.error('Failed to load categories')
        }
    }

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`)
            const data = await res.json()

            if (res.ok) {
                const product: Product = data.product
                setFormData({
                    name: product.name,
                    sku: product.sku,
                    type: product.type,
                    categoryId: product.categoryId,
                    shortDescEn: product.shortDescEn || '',
                    descriptionEn: product.descriptionEn || '',
                    descriptionTa: product.descriptionTa || '',
                    descriptionHi: product.descriptionHi || '',
                    primaryImage: product.primaryImage || '',
                    basePrice: product.basePrice.toString(),
                    retailPrice: product.retailPrice.toString(),
                    wholesalePrice: product.wholesalePrice?.toString() || '',
                    exportPrice: product.exportPrice?.toString() || '',
                    currency: product.currency,
                    currentStock: product.inventory[0]?.currentStock.toString() || '0',
                    unit: product.unit,
                    weight: product.weight?.toString() || '',
                    lowStockAlert: product.inventory[0]?.lowStockAlert.toString() || '10',
                    reorderPoint: product.inventory[0]?.reorderPoint.toString() || '20',
                    warehouse: product.inventory[0]?.warehouse || 'Main Warehouse',
                    location: product.inventory[0]?.location || 'A-01',
                    isOrganic: product.isOrganic,
                    isExportGrade: product.isExportGrade,
                    isFeatured: product.isFeatured,
                    isBestSeller: product.isBestSeller,
                    isNewArrival: product.isNewArrival,
                    status: product.status,
                    metaTitle: product.metaTitle || '',
                    metaDescription: product.metaDescription || '',
                    keywords: product.keywords.join(', '),
                })
            } else {
                toast.error('Product not found')
                router.push('/admin/products')
            }
        } catch (error) {
            toast.error('Failed to load product')
            router.push('/admin/products')
        } finally {
            setFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k)

            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    keywords: keywordsArray,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('Product updated successfully!')
                router.push('/admin/products')
            } else {
                toast.error(data.error || 'Failed to update product')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)

        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: 'DELETE',
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('Product deleted successfully!')
                router.push('/admin/products')
            } else {
                toast.error(data.error || 'Failed to delete product')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="FRUIT">Fruit</option>
                                    <option value="SPICE">Spice</option>
                                    <option value="TREE">Tree</option>
                                    <option value="VALUE_ADDED">Value Added</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Short Description (English)
                                </label>
                                <input
                                    type="text"
                                    value={formData.shortDescEn}
                                    onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Description (English)
                                </label>
                                <textarea
                                    value={formData.descriptionEn}
                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
                        <div className="max-w-xl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Image
                            </label>
                            <ImageUpload
                                value={formData.primaryImage}
                                onChange={(url) => setFormData({ ...formData, primaryImage: url })}
                                onRemove={() => setFormData({ ...formData, primaryImage: '' })}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Base Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Retail Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={formData.retailPrice}
                                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wholesale Price (₹)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.wholesalePrice}
                                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Export Price (₹)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.exportPrice}
                                    onChange={(e) => setFormData({ ...formData, exportPrice: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.currentStock}
                                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="piece">Piece</option>
                                    <option value="litre">Litre</option>
                                    <option value="gram">Gram (g)</option>
                                    <option value="dozen">Dozen</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Low Stock Alert
                                </label>
                                <input
                                    type="number"
                                    value={formData.lowStockAlert}
                                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isOrganic}
                                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">Organic Product</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isExportGrade}
                                    onChange={(e) => setFormData({ ...formData, isExportGrade: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">Export Grade</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">Featured Product</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isBestSeller}
                                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">Best Seller</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isNewArrival}
                                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">New Arrival</span>
                            </label>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="DISCONTINUED">Discontinued</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO (Optional)</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keywords (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Link
                            href="/admin/products"
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
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
                            Are you sure you want to delete <strong>{formData.name}</strong>? The product will be marked as DISCONTINUED.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
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
        </div>
    )
}
