import CategoryForm from '@/components/admin/CategoryForm';
import Link from 'next/link';

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="material-icons">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Category</h1>
          <p className="text-gray-400 mt-1">Create a new product category</p>
        </div>
      </div>

      <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
