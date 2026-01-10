import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import ProductTable from '@/components/admin/ProductTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ProductsResult {
  products: any[];
  error?: string;
}

async function getProducts(): Promise<ProductsResult> {
  try {
    await connectToDatabase();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return {
      products: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        inStock: product.inStock,
        discount: product.discount,
      })),
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      products: [],
      error: error instanceof Error ? error.message : 'Failed to connect to database',
    };
  }
}

export default async function ProductsPage() {
  const result = await getProducts();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your store products</p>
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <span className="material-icons text-red-500 text-3xl">error</span>
            <div>
              <h2 className="text-lg font-semibold text-red-400 mb-2">Database Connection Error</h2>
              <p className="text-gray-400 mb-4">{result.error}</p>
              <Link href="/admin" className="text-[#e53935] hover:underline">
                Go to Dashboard for setup instructions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <p className="text-gray-400 mt-1">Manage your store products</p>
      </div>

      <ProductTable products={result.products} />
    </div>
  );
}
