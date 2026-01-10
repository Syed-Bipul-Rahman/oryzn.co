'use client';

import { useState, useEffect } from 'react';
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
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');

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
  const [additionalImagesInput, setAdditionalImagesInput] = useState(
    initialData?.images?.join('\n') || ''
  );

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

  // Update image preview
  useEffect(() => {
    setImagePreview(formData.image);
  }, [formData.image]);

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
    setIsSubmitting(true);
    setError('');

    // Process tags and additional images
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    const images = additionalImagesInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url);

    const dataToSubmit = {
      ...formData,
      tags,
      images,
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
              Main Image URL *
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              placeholder="https://example.com/image.jpg"
            />
            {imagePreview && (
              <div className="mt-4 relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Images (one URL per line)
            </label>
            <textarea
              value={additionalImagesInput}
              onChange={(e) => setAdditionalImagesInput(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#e53935]"
              placeholder="https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
            />
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
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#e53935] text-white rounded-lg hover:bg-[#c62828] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-icons">save</span>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
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
