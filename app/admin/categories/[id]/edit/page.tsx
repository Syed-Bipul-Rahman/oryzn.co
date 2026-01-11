import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import CategoryForm from '@/components/admin/CategoryForm';
import Link from 'next/link';
import mongoose from 'mongoose';

interface Props {
  params: Promise<{ id: string }>;
}

async function getCategory(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  try {
    await connectToDatabase();
    const category = await Category.findById(id).lean();

    if (!category) {
      return null;
    }

    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      image: category.image || '',
      description: category.description || '',
      isActive: category.isActive,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

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
          <h1 className="text-2xl font-bold text-white">Edit Category</h1>
          <p className="text-gray-400 mt-1">Update category: {category.name}</p>
        </div>
      </div>

      <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
        <CategoryForm initialData={category} isEditing />
      </div>
    </div>
  );
}
