'use client'

import { CreateListingFormData } from '@/hooks/useCreateListingForm'

interface StepImagesProps {
  images: File[]
  onAddImages: (files: File[]) => void
  onRemoveImage: (index: number) => void
}

export function StepImages({ images, onAddImages, onRemoveImage }: StepImagesProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddImages(Array.from(e.target.files))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      onAddImages(Array.from(e.dataTransfer.files))
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-blue-500 transition"
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-sm font-medium mb-1">Drag images here or click to select</p>
          <p className="text-xs text-neutral-500">JPG, PNG, WebP • Max 10 images</p>
        </label>
      </div>

      {images.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">{images.length} image{images.length !== 1 ? 's' : ''} selected</h3>
          <div className="grid grid-cols-3 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                <p className="text-xs text-neutral-500 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📝 Add at least 1 image. High-quality photos help attract buyers!
          </p>
        </div>
      )}
    </div>
  )
}
