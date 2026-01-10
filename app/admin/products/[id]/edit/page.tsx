import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  await connectToDatabase();

  const product = await Product.findById(id).lean();

  if (!product) {
    return null;
  }

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    images: product.images,
    category: product.category,
    rating: product.rating,
    inStock: product.inStock,
    discount: product.discount,
    description: product.description,
    sku: product.sku,
    tags: product.tags,
  };
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-gray-400 mt-1">Update product details</p>
      </div>

      <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
        <ProductForm initialData={product} isEditing />
      </div>
    </div>
  );
}
