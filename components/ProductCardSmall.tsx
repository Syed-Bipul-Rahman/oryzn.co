import Image from "next/image";
import Link from "next/link";

interface ProductCardSmallProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  inStock?: boolean;
  discount?: number;
}

export default function ProductCardSmall({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  inStock = true,
  discount,
}: ProductCardSmallProps) {
  return (
    <Link
      href={`/product/${id}`}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition group block"
    >
      <article>
        <div className="h-28 flex items-center justify-center mb-2">
          <Image
            alt={name}
            className="h-20 w-auto object-contain"
            src={image}
            width={80}
            height={80}
          />
        </div>

        {!inStock && (
          <span className="text-xs text-red-500 font-bold block mb-1">
            Out of Stock
          </span>
        )}

        {inStock && (originalPrice || discount) && (
          <>
            <div className="flex gap-1 mb-1 items-baseline">
              <span className="text-xs font-bold dark:text-white">
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discount && (
              <span className="text-[9px] text-white bg-red-500 px-1 rounded inline-block mb-1">
                -{discount}%
              </span>
            )}
          </>
        )}

        {inStock && !originalPrice && !discount && (
          <div className="flex gap-1 mb-1 items-baseline">
            <span className="text-xs font-bold dark:text-white">
              ${price.toFixed(2)}
            </span>
          </div>
        )}

        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 mb-1 group-hover:text-primary">
          {name}
        </h3>

        <div className="flex items-center text-yellow-400 text-[10px]" aria-label={`Rating: ${rating} out of 5`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="material-icons text-[10px]">
              {i < Math.floor(rating)
                ? "star"
                : i < rating
                ? "star_half"
                : "star_border"}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
