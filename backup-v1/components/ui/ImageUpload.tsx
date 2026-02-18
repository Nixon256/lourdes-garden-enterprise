'use client'

import { useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onRemove: () => void
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (res.ok) {
                onChange(data.url)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(data.error || 'Upload failed')
            }
        } catch (error) {
            toast.error('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative w-full h-64 rounded-lg border-2 border-gray-200 overflow-hidden group">
                    <Image
                        src={value}
                        alt="Product"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label
                    className={`
            flex flex-col items-center justify-center w-full h-64 
            border-2 border-dashed rounded-lg cursor-pointer
            ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-green-500 bg-gray-50 hover:bg-green-50'}
            transition
          `}
                >
                    <div className="flex flex-col items-center justify-center py-6">
                        {uploading ? (
                            <>
                                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-3" />
                                <p className="text-sm text-gray-600">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-600">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    )
}
