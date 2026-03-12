'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Upload, Trash2, Loader2, ImageIcon, ArrowLeft,
    Check, X, GripVertical, Tag
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/layout/Header'

interface GalleryImage {
    id: string
    url: string
    alt: string
    category: string
    order: number
    uploadedAt: string
}

const CATEGORIES = ['farm', 'harvest', 'products', 'nature'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_COLORS: Record<string, string> = {
    farm: 'bg-green-100 text-green-700',
    harvest: 'bg-amber-100 text-amber-700',
    products: 'bg-blue-100 text-blue-700',
    nature: 'bg-emerald-100 text-emerald-700',
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editAlt, setEditAlt] = useState('')
    const [editCategory, setEditCategory] = useState<Category>('farm')
    const [filter, setFilter] = useState<'all' | Category>('all')
    const fileRef = useRef<HTMLInputElement>(null)
    const dropRef = useRef<HTMLDivElement>(null)

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetch('/api/gallery')
            const data = await res.json()
            if (res.ok) setImages(data.images)
        } catch {
            toast.error('Failed to load gallery images')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchImages() }, [fetchImages])

    // Drag & drop
    useEffect(() => {
        const el = dropRef.current
        if (!el) return
        const prevent = (e: DragEvent) => e.preventDefault()
        const onDrop = (e: DragEvent) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'))
            if (files.length) uploadFiles(files)
        }
        el.addEventListener('dragover', prevent)
        el.addEventListener('drop', onDrop)
        return () => {
            el.removeEventListener('dragover', prevent)
            el.removeEventListener('drop', onDrop)
        }
    }, [])

    const uploadFiles = async (files: File[]) => {
        setUploading(true)
        let uploaded = 0
        for (const file of files) {
            if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); continue }
            try {
                const fd = new FormData()
                fd.append('file', file)
                const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
                const upData = await upRes.json()
                if (!upRes.ok) { toast.error(`Upload failed: ${file.name}`); continue }

                const addRes = await fetch('/api/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: upData.url, alt: file.name.replace(/\.[^.]+$/, ''), category: 'farm' }),
                })
                if (addRes.ok) uploaded++
                else toast.error(`Failed to save: ${file.name}`)
            } catch {
                toast.error(`Error uploading ${file.name}`)
            }
        }
        setUploading(false)
        if (uploaded > 0) {
            toast.success(`${uploaded} image${uploaded > 1 ? 's' : ''} uploaded!`)
            fetchImages()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length) uploadFiles(files)
        e.target.value = ''
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this image from the gallery?')) return
        setDeletingId(id)
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Image removed')
                setImages(prev => prev.filter(img => img.id !== id))
            } else toast.error('Failed to delete image')
        } catch {
            toast.error('Something went wrong')
        } finally {
            setDeletingId(null)
        }
    }

    const startEdit = (img: GalleryImage) => {
        setEditingId(img.id)
        setEditAlt(img.alt)
        setEditCategory(img.category as Category)
    }

    const saveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alt: editAlt, category: editCategory }),
            })
            if (res.ok) {
                toast.success('Updated')
                setImages(prev => prev.map(img => img.id === id ? { ...img, alt: editAlt, category: editCategory } : img))
                setEditingId(null)
            } else toast.error('Update failed')
        } catch {
            toast.error('Something went wrong')
        }
    }

    const filtered = filter === 'all' ? images : images.filter(img => img.category === filter)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-200 transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gallery Manager</h1>
                            <p className="text-sm text-gray-500">{images.length} images • Changes reflect instantly on public gallery</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload Images'}
                    </button>
                    <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                {/* Drag & Drop Zone */}
                <div
                    ref={dropRef}
                    onClick={() => fileRef.current?.click()}
                    className="mb-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50 hover:bg-green-100 transition cursor-pointer p-8 text-center"
                >
                    <Upload className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-700">Drag & drop images here, or click to browse</p>
                    <p className="text-xs text-green-500 mt-1">PNG, JPG, WEBP up to 10MB each. Multiple files supported.</p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {(['all', ...CATEGORIES] as const).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition ${filter === cat
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                                }`}
                        >
                            {cat === 'all' ? `All (${images.length})` : `${cat} (${images.filter(i => i.category === cat).length})`}
                        </button>
                    ))}
                </div>

                {/* Image Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No images yet. Upload some above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filtered.map(img => (
                            <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100">
                                    <Image
                                        src={img.url}
                                        alt={img.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    />
                                    {/* Overlay actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => startEdit(img)}
                                            className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition"
                                            title="Edit label"
                                        >
                                            <Tag className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            disabled={deletingId === img.id}
                                            className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 disabled:opacity-50 transition"
                                            title="Delete"
                                        >
                                            {deletingId === img.id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Edit form inline */}
                                {editingId === img.id ? (
                                    <div className="p-2 space-y-1.5">
                                        <input
                                            autoFocus
                                            value={editAlt}
                                            onChange={e => setEditAlt(e.target.value)}
                                            placeholder="Image label"
                                            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 text-gray-900"
                                        />
                                        <select
                                            value={editCategory}
                                            onChange={e => setEditCategory(e.target.value as Category)}
                                            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 text-gray-900"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <div className="flex gap-1">
                                            <button onClick={() => saveEdit(img.id)} className="flex-1 flex items-center justify-center gap-1 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition">
                                                <Check className="w-3 h-3" /> Save
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="flex-1 flex items-center justify-center gap-1 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 transition text-gray-600">
                                                <X className="w-3 h-3" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        <p className="text-xs font-medium text-gray-700 truncate" title={img.alt}>{img.alt}</p>
                                        <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${CATEGORY_COLORS[img.category] || 'bg-gray-100 text-gray-600'}`}>
                                            {img.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
