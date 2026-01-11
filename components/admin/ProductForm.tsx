'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductFormData {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  inStock: boolean;
  discount?: number;
  description?: string;
  sku?: string;
  tags?: string[];
}

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  isEditing?: boolean;
}

const categories = [
  'Vegetables',
  'Fresh Fruits',
  'Drinks & Juice',
  'Frozen Food',
  'Desserts',
  'Dairy',
  'Bakery',
  'Meat & Seafood',
];

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(
    initialData?.images || []
  );

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingAdditional, setIsDraggingAdditional] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice,
    image: initialData?.image || '',
    images: initialData?.images || [],
    category: initialData?.category || 'Vegetables',
    rating: initialData?.rating || 5,
    inStock: initialData?.inStock ?? true,
    discount: initialData?.discount,
    description: initialData?.description || '',
    sku: initialData?.sku || '',
    tags: initialData?.tags || [],
  });

  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');

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

  // Upload files to server
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const formDataUpload = new FormData();
    files.forEach((file) => formDataUpload.append('files', file));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to upload images');
    }

    const data = await response.json();
    return data.urls;
  };

  // Handle main image selection
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload the file
    setIsUploading(true);
    try {
      const urls = await uploadFiles([file]);
      setFormData((prev) => ({ ...prev, image: urls[0] }));
      setImagePreview(urls[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setImagePreview('');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle additional images selection
  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Show previews immediately
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((prev) => [...prev, ...previewUrls]);

    // Upload the files
    setIsUploading(true);
    try {
      const urls = await uploadFiles(files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
      // Replace blob URLs with actual URLs
      setAdditionalImagePreviews((prev) => {
        const existingUrls = prev.filter((url) => !url.startsWith('blob:'));
        return [...existingUrls, ...urls];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      // Remove failed previews
      setAdditionalImagePreviews((prev) =>
        prev.filter((url) => !url.startsWith('blob:'))
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview('');
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers for main image
  const handleMainDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMainDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMain(true);
  };

  const handleMainDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMain(false);
  };

  const handleMainDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMain(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (!imageFile) {
      setError('Please drop an image file');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    // Upload the file
    setIsUploading(true);
    try {
      const urls = await uploadFiles([imageFile]);
      setFormData((prev) => ({ ...prev, image: urls[0] }));
      setImagePreview(urls[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setImagePreview('');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers for additional images
  const handleAdditionalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAdditionalDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAdditional(true);
  };

  const handleAdditionalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAdditional(false);
  };

  const handleAdditionalDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAdditional(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      setError('Please drop image files');
      return;
    }

    // Show previews immediately
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((prev) => [...prev, ...previewUrls]);

    // Upload the files
    setIsUploading(true);
    try {
      const urls = await uploadFiles(files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
      // Replace blob URLs with actual URLs
      setAdditionalImagePreviews((prev) => {
        const existingUrls = prev.filter((url) => !url.startsWith('blob:'));
        return [...existingUrls, ...urls];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      // Remove failed previews
      setAdditionalImagePreviews((prev) =>
        prev.filter((url) => !url.startsWith('blob:'))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setError('Please upload a main image');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Process tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const dataToSubmit = {
      ...formData,
      tags,
    };

    try {
      const url = isEditing
        ? `/api/products/${initialData?.id}`
        : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              placeholder="Enter product name"
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
              placeholder="product-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly identifier (auto-generated from name)
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price and Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              />
            </div>
          </div>

          {/* Discount and Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discount %
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount || ''}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.5"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              />
            </div>
          </div>

          {/* SKU and In Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
                placeholder="SKU-001"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="w-5 h-5 bg-gray-800 border border-gray-700 rounded text-[#e53935] focus:ring-[#e53935]"
                />
                <span className="text-gray-300">In Stock</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              placeholder="organic, fresh, sale"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Main Image *
            </label>
            <div
              onClick={() => mainImageInputRef.current?.click()}
              onDragOver={handleMainDragOver}
              onDragEnter={handleMainDragEnter}
              onDragLeave={handleMainDragLeave}
              onDrop={handleMainDrop}
              className={`w-full px-4 py-6 bg-gray-800 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDraggingMain
                  ? 'border-[#e53935] bg-[#e53935]/10'
                  : 'border-gray-700 hover:border-[#e53935]'
              } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
              <span className={`material-icons text-4xl mb-2 ${isDraggingMain ? 'text-[#e53935]' : 'text-gray-500'}`}>
                {isDraggingMain ? 'file_download' : 'cloud_upload'}
              </span>
              <p className={isDraggingMain ? 'text-[#e53935]' : 'text-gray-400'}>
                {isUploading ? 'Uploading...' : isDraggingMain ? 'Drop image here' : 'Click or drag image here'}
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
                  onClick={removeMainImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Images
            </label>
            <div
              onClick={() => additionalImagesInputRef.current?.click()}
              onDragOver={handleAdditionalDragOver}
              onDragEnter={handleAdditionalDragEnter}
              onDragLeave={handleAdditionalDragLeave}
              onDrop={handleAdditionalDrop}
              className={`w-full px-4 py-6 bg-gray-800 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDraggingAdditional
                  ? 'border-[#e53935] bg-[#e53935]/10'
                  : 'border-gray-700 hover:border-[#e53935]'
              } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input
                ref={additionalImagesInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="hidden"
              />
              <span className={`material-icons text-4xl mb-2 ${isDraggingAdditional ? 'text-[#e53935]' : 'text-gray-500'}`}>
                {isDraggingAdditional ? 'file_download' : 'add_photo_alternate'}
              </span>
              <p className={isDraggingAdditional ? 'text-[#e53935]' : 'text-gray-400'}>
                {isUploading ? 'Uploading...' : isDraggingAdditional ? 'Drop images here' : 'Click or drag images here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Select or drop multiple images</p>
            </div>
            {additionalImagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {additionalImagePreviews.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={url}
                      alt={`Additional ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-icons text-xs">close</span>
                    </button>
                  </div>
                ))}
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
              value={formData.description || ''}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              placeholder="Enter product description..."
            />
          </div>
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-800">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-6 py-3 bg-[#e53935] text-white rounded-lg hover:bg-[#c62828] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-icons">save</span>
          {isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : isEditing ? 'Update Product' : 'Create Product'}
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
