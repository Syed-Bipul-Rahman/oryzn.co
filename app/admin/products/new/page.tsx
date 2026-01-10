import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <p className="text-gray-400 mt-1">Create a new product for your store</p>
      </div>

      <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
        <ProductForm />
      </div>
    </div>
  );
}
