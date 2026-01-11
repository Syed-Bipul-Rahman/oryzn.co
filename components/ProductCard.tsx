import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  inStock?: boolean;
  discount?: number;
}

export default function ProductCard({
  slug,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 5,
  inStock = true,
  discount,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition group block"
    >
      <article>
        <div className="relative mb-3 h-32 flex items-center justify-center">
          <Image
            alt={name}
            className="h-28 w-auto object-contain"
            src={image}
            width={112}
            height={112}
            unoptimized
          />
          {category && (
            <span className="absolute top-0 left-0 text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {category}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {discount ? (
            <span className="text-[10px] text-white bg-secondary px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          ) : !inStock ? (
            <span className="text-[10px] text-white bg-secondary px-1.5 py-0.5 rounded">
              Out of Stock
            </span>
          ) : null}

          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2 group-hover:text-primary transition">
            {name}
          </h3>

          <div className="flex items-center text-yellow-400 text-xs" aria-label={`Rating: ${rating} out of 5`}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-icons text-[14px]">
                {i < Math.floor(rating)
                  ? "star"
                  : i < rating
                  ? "star_half"
                  : "star_border"}
              </span>
            ))}
            <span className="text-gray-400 ml-1 text-[10px]">({rating.toFixed(2)})</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
