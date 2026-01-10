import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import ProductCardSmall from "@/components/ProductCardSmall";
import {
  getHotSaleProducts,
  getFreshVegetables,
  getFrozenFood,
} from "@/lib/products";

export default async function Home() {
  const hotSaleProducts = await getHotSaleProducts();
  const vegetables = await getFreshVegetables();
  const frozenFood = await getFrozenFood();

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-6 flex gap-6">
        <Sidebar />

        <main className="flex-1 w-full min-w-0">
          {/* Hero Banners */}
          <section aria-label="Featured promotions" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4 relative overflow-hidden h-40 group">
              <div className="relative z-10 w-2/3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                  Creamy Fruits Baby Jem
                </h3>
                <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                  $12.99
                </span>
                <Link
                  href="/category/fruits"
                  className="block bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded transition mt-2 w-fit"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 relative overflow-hidden h-40 group">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-20">
                20% Off
              </div>
              <div className="relative z-10 w-2/3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                  100% Fresh Vegetables
                </h3>
                <Link
                  href="/category/vegetables"
                  className="block bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded transition mt-4 w-fit"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 relative overflow-hidden h-40 group">
              <div className="relative z-10 w-2/3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                  Pure Farm Fresh Milk
                </h3>
                <Link
                  href="/category/dairy"
                  className="block bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded transition mt-4 w-fit"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-4 relative overflow-hidden h-40 group">
              <div className="relative z-10 w-2/3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                  Creamy Fruits Baby Jem
                </h3>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                  $12.99
                </span>
                <Link
                  href="/category/fruits"
                  className="block bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded transition mt-2 w-fit"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </section>

          {/* Hot Sale Section */}
          <section
            aria-labelledby="hot-sale-heading"
            className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="hot-sale-heading"
                className="text-xl font-bold text-gray-900 dark:text-white relative"
              >
                Today&apos;s Hot Sale
                <span className="block h-1 w-12 bg-secondary mt-1 rounded-full"></span>
              </h2>
              <div className="flex gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition shadow-sm border border-gray-200 dark:border-gray-700"
                  aria-label="Previous products"
                >
                  <span className="material-icons text-sm">arrow_back_ios_new</span>
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white transition shadow-sm border border-gray-200 dark:border-gray-700"
                  aria-label="Next products"
                >
                  <span className="material-icons text-sm">arrow_forward_ios</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {hotSaleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  category={product.category}
                  rating={product.rating}
                  inStock={product.inStock}
                  discount={product.discount}
                />
              ))}
            </div>
          </section>

          {/* Fresh Vegetables Section */}
          <section aria-labelledby="vegetables-heading" className="mb-8">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              <h2
                id="vegetables-heading"
                className="text-xl font-bold text-gray-900 dark:text-white relative"
              >
                Fresh Vegetables
                <span className="block h-0.5 w-16 bg-primary mt-3 absolute bottom-[-1px]"></span>
              </h2>
              <div className="flex gap-2">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-primary hover:border-primary dark:hover:border-primary transition"
                  aria-label="Previous"
                >
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-primary hover:border-primary dark:hover:border-primary transition"
                  aria-label="Next"
                >
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {vegetables.map((product) => (
                <ProductCardSmall
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  rating={product.rating}
                  inStock={product.inStock}
                  discount={product.discount}
                />
              ))}
            </div>
          </section>

          {/* Frozen Food Section */}
          <section aria-labelledby="frozen-heading" className="mb-8">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              <h2
                id="frozen-heading"
                className="text-xl font-bold text-gray-900 dark:text-white relative"
              >
                Frozen Food
                <span className="block h-0.5 w-16 bg-primary mt-3 absolute bottom-[-1px]"></span>
              </h2>
              <div className="flex gap-2">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-primary hover:border-primary dark:hover:border-primary transition"
                  aria-label="Previous"
                >
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-primary hover:border-primary dark:hover:border-primary transition"
                  aria-label="Next"
                >
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {frozenFood.map((product) => (
                <ProductCardSmall
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  rating={product.rating}
                  inStock={product.inStock}
                  discount={product.discount}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
