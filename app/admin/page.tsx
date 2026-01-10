import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

interface Stats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  categoryCounts: { _id: string; count: number }[];
  recentProducts: any[];
  error?: string;
}

async function getStats(): Promise<Stats> {
  try {
    await connectToDatabase();

    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });

    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      categoryCounts,
      recentProducts,
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      totalProducts: 0,
      inStockProducts: 0,
      outOfStockProducts: 0,
      categoryCounts: [],
      recentProducts: [],
      error: error instanceof Error ? error.message : 'Failed to connect to database',
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  if (stats.error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <span className="material-icons text-red-500 text-3xl">error</span>
            <div>
              <h2 className="text-lg font-semibold text-red-400 mb-2">Database Connection Error</h2>
              <p className="text-gray-400 mb-4">{stats.error}</p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm">
                <p className="text-gray-300 mb-2">To fix this, create a <code className="text-yellow-400">.env.local</code> file with:</p>
                <pre className="text-green-400 overflow-x-auto">
{`MONGODB_URI=mongodb+srv://user:pass@your-cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <span className="material-icons text-blue-500">inventory_2</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <span className="material-icons text-green-500">check_circle</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">In Stock</p>
              <p className="text-2xl font-bold text-white">{stats.inStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <span className="material-icons text-red-500">error</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-white">{stats.outOfStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="space-y-3">
            {stats.categoryCounts.length === 0 ? (
              <p className="text-gray-500">No categories yet</p>
            ) : (
              stats.categoryCounts.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-300">{cat._id}</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                    {cat.count} products
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products/new"
              className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-[#e53935]">add_circle</span>
              <span className="text-gray-300 text-sm">Add Product</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-blue-500">list</span>
              <span className="text-gray-300 text-sm">View All</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-green-500">storefront</span>
              <span className="text-gray-300 text-sm">View Store</span>
            </Link>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="material-icons text-yellow-500">map</span>
              <span className="text-gray-300 text-sm">Sitemap</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-[#181818] rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Products</h2>
          <Link
            href="/admin/products"
            className="text-[#e53935] hover:underline text-sm"
          >
            View All
          </Link>
        </div>
        {stats.recentProducts.length === 0 ? (
          <p className="text-gray-500">No products yet. Add your first product!</p>
        ) : (
          <div className="space-y-3">
            {stats.recentProducts.map((product) => (
              <div
                key={product._id.toString()}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white">{product.name}</p>
                    <p className="text-gray-500 text-sm">{product.category}</p>
                  </div>
                </div>
                <span className="text-[#e53935] font-medium">${product.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
