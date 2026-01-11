import connectToDatabase from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import CategoryTable from '@/components/admin/CategoryTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CategoriesResult {
  categories: any[];
  error?: string;
}

async function getCategories(): Promise<CategoriesResult> {
  try {
    await connectToDatabase();

    const categories = await Category.find().sort({ name: 1 }).lean();

    return {
      categories: categories.map((category) => ({
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      })),
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      categories: [],
      error: error instanceof Error ? error.message : 'Failed to connect to database',
    };
  }
}

export default async function CategoriesPage() {
  const result = await getCategories();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">Manage your product categories</p>
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
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-gray-400 mt-1">Manage your product categories</p>
      </div>

      <CategoryTable categories={result.categories} />
    </div>
  );
}
