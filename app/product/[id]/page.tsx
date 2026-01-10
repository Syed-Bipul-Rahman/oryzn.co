import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductById } from "@/lib/products";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Orizn. Fresh ${product.category} delivered to your door. Price: $${product.price}`,
    keywords: [
      product.name,
      product.category,
      "buy online",
      "fresh groceries",
      "Orizn store",
      ...(product.tags || []),
    ],
    openGraph: {
      title: `${product.name} | Orizn Grocery Store`,
      description: product.description || `Buy ${product.name} at Orizn for just $${product.price}`,
      images: [
        {
          url: product.image,
          width: 600,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Buy ${product.name} at Orizn`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const productImages = product.images || [product.image];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: productImages,
    description: product.description || `Fresh ${product.category} from Orizn`,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Orizn",
    },
    offers: {
      "@type": "Offer",
      url: `https://orizn-store.vercel.app/product/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-gray-50 dark:bg-surface-dark py-4"
      >
        <div className="container mx-auto px-4 text-sm text-gray-500 dark:text-gray-400">
          <ol className="flex items-center" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link className="hover:text-primary" href="/" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span className="mx-2">/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link className="hover:text-primary" href="/products" itemProp="item">
                <span itemProp="name">Products</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <span className="mx-2">/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-primary font-medium" itemProp="name">
                {product.name}
              </span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <article itemScope itemType="https://schema.org/Product">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-8 flex items-center justify-center h-[400px]">
                <Image
                  alt={product.name}
                  className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                  src={productImages[0]}
                  width={400}
                  height={400}
                  priority
                  itemProp="image"
                />
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {productImages.slice(0, 3).map((img, idx) => (
                    <button
                      key={idx}
                      className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 cursor-pointer hover:border-primary transition-colors h-32 flex items-center justify-center"
                    >
                      <Image
                        alt={`${product.name} view ${idx + 1}`}
                        className="max-h-full object-contain"
                        src={img}
                        width={100}
                        height={100}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2"
                itemProp="name"
              >
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex text-yellow-400 text-sm"
                  itemProp="aggregateRating"
                  itemScope
                  itemType="https://schema.org/AggregateRating"
                >
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-icons text-lg">
                      {i < Math.floor(product.rating)
                        ? "star"
                        : i < product.rating
                        ? "star_half"
                        : "star_border"}
                    </span>
                  ))}
                  <meta itemProp="ratingValue" content={String(product.rating)} />
                  <meta itemProp="reviewCount" content="1" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  (1 Customer Review)
                </span>
              </div>

              <p
                className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                itemProp="description"
              >
                {product.description ||
                  "Fresh and high-quality product delivered straight to your door. Our products are sourced from trusted suppliers to ensure the best quality for our customers."}
              </p>

              <ul className="mb-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-icons text-xs text-gray-400">circle</span>
                  100% Fresh and Organic
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-xs text-gray-400">circle</span>
                  Fast Delivery Available
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-xs text-gray-400">circle</span>
                  Quality Guaranteed
                </li>
              </ul>

              <div
                className="text-3xl font-bold text-primary mb-2"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <span itemProp="priceCurrency" content="USD">$</span>
                <span itemProp="price" content={String(product.price)}>
                  {product.price.toFixed(2)}
                </span>
                <link
                  itemProp="availability"
                  href={
                    product.inStock
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock"
                  }
                />
              </div>

              <div
                className={`flex items-center gap-2 mb-6 font-medium ${
                  product.inStock
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <span className="material-icons">
                  {product.inStock ? "check_circle" : "cancel"}
                </span>
                {product.inStock ? "In stock" : "Out of stock"}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center border border-border-light dark:border-border-dark rounded-md">
                  <button
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <label htmlFor="quantity" className="sr-only">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    className="w-12 text-center border-none focus:ring-0 bg-transparent py-2 font-bold dark:text-white"
                    type="number"
                    defaultValue={1}
                    min={1}
                  />
                  <button
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-primary hover:bg-green-800 text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!product.inStock}
                >
                  <span className="material-icons">shopping_basket</span>
                  Add to cart
                </button>
                <button className="border border-border-light dark:border-border-dark hover:border-primary hover:text-primary text-gray-700 dark:text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-colors">
                  <span className="material-icons">bolt</span>
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    SKU:
                  </span>{" "}
                  {product.sku || `ZL-${product.id}`}
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Category:
                  </span>{" "}
                  <span itemProp="category">{product.category}</span>
                </div>
                {product.tags && (
                  <div>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      Tags:
                    </span>{" "}
                    {product.tags.join(", ")}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 mb-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <span className="material-icons">favorite_border</span>
                  Add To Wishlist
                </button>
                <span className="text-gray-300">|</span>
                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <span className="material-icons">compare_arrows</span>
                  Add To Compare
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 dark:text-white">
                  Share:
                </span>
                <a
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                  href="#"
                  aria-label="Share on Facebook"
                >
                  <span className="material-icons text-sm">facebook</span>
                </a>
                <a
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-black hover:text-white transition-colors"
                  href="#"
                  aria-label="Share on Twitter"
                >
                  <span className="material-icons text-sm">close</span>
                </a>
                <a
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-green-500 hover:text-white transition-colors"
                  href="#"
                  aria-label="Share on WhatsApp"
                >
                  <span className="material-icons text-sm">chat</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
