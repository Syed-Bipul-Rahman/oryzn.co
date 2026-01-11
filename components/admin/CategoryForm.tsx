'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CategoryFormData {
  name: string;
  slug: string;
  image: string;
  description: string;
  isActive: boolean;
}

interface CategoryFormProps {
  initialData?: CategoryFormData & { id?: string };
  isEditing?: boolean;
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [isDragging, setIsDragging] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    image: initialData?.image || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, isEditing]);

  // Upload file to server
  const uploadFile = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append('files', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.urls[0];
  };

  // Handle image selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processImageFile(file);
  };

  // Process image file (used by both click and drag)
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload the file
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setFormData((prev) => ({ ...prev, image: url }));
      setImagePreview(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setImagePreview('');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (!imageFile) {
      setError('Please drop an image file');
      return;
    }

    await processImageFile(imageFile);
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/categories/${initialData?.id}`
        : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
          placeholder="Enter category name"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Slug *
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
          placeholder="category-slug"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL-friendly identifier (auto-generated from name)
        </p>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category Image
        </label>
        <div
          onClick={() => imageInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full px-4 py-6 bg-gray-800 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#e53935] bg-[#e53935]/10'
              : 'border-gray-700 hover:border-[#e53935]'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className={`material-icons text-4xl mb-2 ${isDragging ? 'text-[#e53935]' : 'text-gray-500'}`}>
            {isDragging ? 'file_download' : 'cloud_upload'}
          </span>
          <p className={isDragging ? 'text-[#e53935]' : 'text-gray-400'}>
            {isUploading ? 'Uploading...' : isDragging ? 'Drop image here' : 'Click or drag image here'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP up to 10MB</p>
        </div>
        {imagePreview && (
          <div className="mt-4 relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden group">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
              onError={() => setImagePreview('')}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-icons text-sm">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
          placeholder="Enter category description..."
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 bg-gray-800 border border-gray-700 rounded text-[#e53935] focus:ring-[#e53935]"
          />
          <span className="text-gray-300">Active</span>
        </label>
        <p className="text-xs text-gray-500">Inactive categories won't appear in product forms</p>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-800">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-6 py-3 bg-[#e53935] text-white rounded-lg hover:bg-[#c62828] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-icons">save</span>
          {isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : isEditing ? 'Update Category' : 'Create Category'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
