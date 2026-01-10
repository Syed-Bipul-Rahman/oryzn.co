import connectToDatabase from './mongodb';
import ProductModel, { IProductDocument } from './models/Product';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  inStock: boolean;
  discount?: number;
  description?: string;
  sku?: string;
  tags?: string[];
}

// Transform MongoDB document to Product interface
function transformProduct(doc: IProductDocument): Product {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    originalPrice: doc.originalPrice,
    image: doc.image,
    images: doc.images,
    category: doc.category,
    rating: doc.rating,
    inStock: doc.inStock,
    discount: doc.discount,
    description: doc.description,
    sku: doc.sku,
    tags: doc.tags,
  };
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  await connectToDatabase();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
  return products.map(transformProduct);
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectToDatabase();
  const product = await ProductModel.findOne({ slug }).lean();
  return product ? transformProduct(product) : null;
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  await connectToDatabase();

  // Try to find by MongoDB ObjectId first
  try {
    const product = await ProductModel.findById(id).lean();
    if (product) return transformProduct(product);
  } catch {
    // Not a valid ObjectId, try finding by slug
  }

  // Fallback to slug lookup
  const product = await ProductModel.findOne({ slug: id }).lean();
  return product ? transformProduct(product) : null;
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await connectToDatabase();
  const products = await ProductModel.find({ category }).lean();
  return products.map(transformProduct);
}

// Get hot sale products (products with discount)
export async function getHotSaleProducts(): Promise<Product[]> {
  await connectToDatabase();
  const products = await ProductModel.find({ discount: { $gt: 0 } })
    .sort({ discount: -1 })
    .limit(5)
    .lean();
  return products.map(transformProduct);
}

// Get fresh vegetables (vegetables and fruits)
export async function getFreshVegetables(): Promise<Product[]> {
  await connectToDatabase();
  const products = await ProductModel.find({
    category: { $in: ['Vegetables', 'Fresh Fruits'] },
  })
    .limit(6)
    .lean();
  return products.map(transformProduct);
}

// Get frozen food and drinks
export async function getFrozenFood(): Promise<Product[]> {
  await connectToDatabase();
  const products = await ProductModel.find({
    category: { $in: ['Frozen Food', 'Drinks & Juice'] },
  })
    .limit(6)
    .lean();
  return products.map(transformProduct);
}

// ============================================
// Static data fallback for when DB is not ready
// ============================================

export const staticProducts: Product[] = [
  {
    id: "1",
    name: "Russet Idaho Potatoes Fresh",
    slug: "russet-idaho-potatoes",
    price: 30.0,
    originalPrice: 38.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAg6v1DUzBpPbBT61MrwbnFduLcslHokpNxcQ57gPtHHWSPXXk1m4s6urhh_lCU6Ui-6VK1PbH410Y2RYuMCdk9rgxRiZsFYIv1nnkeHzYNU347r7Y6PL6ISDy0W6PR9FTJFlEHnbMjs-voTwThGzCjJICdqHMkdbi9UHEZWQZLT0Ws3yAWiEo1ABOBHVfVegTT5nezZ2-6RZ32RpI9BxKd004CQXI45DG0e7KsBvGyoFXZnG5tt5D3WiA6k8QgdQVF2U_3S7sD78a",
    category: "Vegetables",
    rating: 4.5,
    inStock: true,
    discount: 16,
  },
  {
    id: "2",
    name: "Aptamil Gold+ ProNutra Baby Formula",
    slug: "aptamil-gold-pronutra",
    price: 25.0,
    originalPrice: 30.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuz6mJ_dHPn_EVGsXeELBKNZFdjyHPxUVg-8-L8SgcilHvNcNgOCQs0sVkcM1sAgag5BRc7cy2XWiUucQ517vMY9fHKQF4CRqsfpXXFc740FYeYyoSp1g4mF85KTh3EbdRJKsCM0j3Mozu-QYNs5uih1t0LBCS8HmDh-lh8n1nZen7VZo3vVpe3rrRt0WIObwvJwJEfLuRppSVJ5e1jktrjjgrhQHoub_rElSh8-twMJT5x-LLjaI4j_lvqYGzwHRWIliHHBMeWiPX",
    category: "Desserts",
    rating: 5,
    inStock: true,
    discount: 44,
  },
  {
    id: "3",
    name: "Mexican Nature's Sweet Bounty",
    slug: "mexican-natures-sweet",
    price: 52.0,
    originalPrice: 56.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwYk0tEbCHthhVa-Jk0sqKIwHluNE06Ucw2LKVDCFaaRH_ulQcwLJq4etsGpUlC5YVYbilf0uROten-Yg4m06ZFhoVF3z2CNWnnQaeUG-OP0eBONSHLcLmCjYAhoYQsOfLUNKP_BsiieuqcQyE6-wjsXw4eIjA3h7QVJEwWBQURE9bb0xv006s1hDL8hH4o3YodOFjPwPRpaX_xWQg0w9MNGB2vGA2ai3CAdodjW2xFbkTSOMB0hyalaI65hueqFXVJ_endznnl9jH",
    category: "Fresh Fruits",
    rating: 4,
    inStock: true,
    discount: 7,
  },
  {
    id: "4",
    name: "Diet A&W Root Beer",
    slug: "diet-aw-root-beer",
    price: 30.0,
    originalPrice: 34.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmOAoq3ivR0CZOPoGUazSUXPxNjd3WXcCHVzC3jckpEqzq5k6c46bRAKH2Brcg3vulmMgidt8wjIPx-DFEDsjakkyFYxXPrEMBm0exgRB8zg5hN1nNnXs_jlfdy9OBHIL-kqxQXW_iZTLl5FOU-FrQsNT8aO_OF9H-3pK8y7lTlt5kci-6Gzg3Xqf3CBUX7LYbX423ii9gEYf3wmPk2F3UjmtsRK9LEoizgq4lsQ8RF4lmKnyyUgGVXtjU-4D4wOZinlxke5PSy66V",
    category: "Drinks & Juice",
    rating: 5,
    inStock: true,
    discount: 12,
  },
  {
    id: "5",
    name: "Whole Foods Market Organic Vegetables",
    slug: "whole-foods-organic-vegetables",
    price: 3.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBW1vV8IgzPoi0NMEdkoLg2bVGvSMlOlnlaLeRYKhhX3G5GQs-CCSVk1y5wL4GaJxHWureP5m8pQJD1QHYyMpEKeiDRnpQQasSFOyp13MPwNKRIOeNcRKn0bR5141iJeZGHrZU7M_yAMo4vTZAZZYofd4pdzif2rn-uhRgPSuE8aKKQq65cmKyjc2nrgtC66jGjHrUzJ_X8Ylqx6Oaj4Qn35jAUYsgcjZyn0OgLcN1hV6B5ovfIya2RJIEkWT0IE7xUI4R_BvsuqAIN",
    category: "Vegetables",
    rating: 5,
    inStock: false,
  },
  {
    id: "6",
    name: "Organic Trimmed Green Beans",
    slug: "organic-green-beans",
    price: 15.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVyij7ICLB73zM_-90CYD1VjYeh98ZgQk9JFwwyTfUtBB0Fm1HOnCJyiD9bumwQaXeTq5rq6qmCkUTfGpLAk8gBEh2KV2UMsOBOJnQRx-XZoMS6EMqjJ8vUw6cA6F2kNyFn5fPx2_Dbxfc47QxyVpxbLzax6VdsEFKwhv5aAytHeHQopqYFiqcAjjARHZ1ugLefyTJZ8GNEl15LibRNBs37o-N1ogKX9F-USPNQLJ1KU7rc1lSapEVzXgAGQ1mhqoW1Uqq_O5k7iOj",
    category: "Vegetables",
    rating: 5,
    inStock: false,
  },
  {
    id: "7",
    name: "Whole Foods Market Romaine Hearts",
    slug: "romaine-hearts",
    price: 19.0,
    originalPrice: 22.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZXSqY1h-uHM6Ps1xycXYWmgQ0HFmFMFkdxNOzqTbZ-IhRlMSn51y7fqUs2sAsyZKIr9iG6HYdE-TPS5lzm9umHphoMLrJr39aM-GSiPP8ktPgu-e8digD9NRwdTI5UhmrtPAVHpIdEwbTkjncICMN3keLH6IMnznAigFILbohsIlDpNxtZLSZhOJrSO4TVSJHEZpxAxIsnMRgRaHfVTW5OyKkeJvfUqAnhcS6B5E21gQZkKr_YRpdeyYY8GYOcRZYVzlK4Ink_h1N",
    category: "Vegetables",
    rating: 5,
    inStock: true,
    discount: 14,
  },
  {
    id: "8",
    name: "Fresh and Sweet Watermelon",
    slug: "fresh-watermelon",
    price: 18.0,
    originalPrice: 45.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJr5LZDM_UyjR6JXx81Rs6tSWvGelEG5l7DpznXhkyY87LnB_HcYvU2Q8AXYPxYKYGgwa3MCYscZU_-9r651uTpmwcZcAx5lXRg7HiqG52TrniMGwcVQVK660GlQ0RNYLMMfIbW8PSgv0s3ew-OmwpvzuyG4CC07VlRmYE5TnBQolFgFndtglV_Pp1bTG5tPna4tELFqZYHTTOPyfJojWHSWFIxv8-kuayvlw-aoc5E7CKP7V5YmpSZJ-G-5zhvb3-5S48m4EDyGm1",
    category: "Fresh Fruits",
    rating: 5,
    inStock: true,
    discount: 33,
  },
  {
    id: "9",
    name: "Avocado Creamy Elegance Pure",
    slug: "avocado-creamy-elegance",
    price: 22.0,
    originalPrice: 28.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDN-KcwZblONxPAEnhi3SIqUpC5Rh6ekp4b2BWR3BkbOLoSndeiSVAW5P4oovcRSSZ1Ykf1CxP-MRne1fTQzl8OJ5VaYTyoWTcImE5QyG70GfZa8EN2c7a_CqGp_2PTCxoo-akIq2TPdeCrWP8TILBsqjctHNUwzFcLgrsuHAumvYUWcOEaeB4oTMzhcAZypyl6Aw_GYyj_GxuriQTtwACWpgOUIh2H45oEO1pdNm4Li63Xezhq_CUvTrbd5DkrN14DFJHrqqS3Os",
    category: "Vegetables",
    rating: 5,
    inStock: true,
    discount: 21,
  },
  {
    id: "10",
    name: "Cantaloupe Melon Fresh Organic Cut",
    slug: "cantaloupe-melon",
    price: 53.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5KjW_hukmpF6rmlp2i9QO9dQL2E3hRvw2Dd1a2q5ficU6V3EM9JqhsFuJ5Ap_m6UY6U8kqYnoW1r-RNoKOlx4kJwM6MiM2KfGQ0kZl0HPRe15xjjSEdcXmPjVdzLLasaT9V_dPb-5mBKHIMYAOnO-GVsRAU3meen_kWwnRLBDM0quQzKa5fWhvNjToSuPvGKeKIyNzy87OR91mkx_bq7Pv4lvsQla0pKu0bupQ1OYE19Afy9_v7NpnRiVFtOwvSzN1PQjGojloL2h",
    category: "Fresh Fruits",
    rating: 5,
    inStock: true,
  },
  {
    id: "11",
    name: "Guava Organic Fruits",
    slug: "guava-organic-fruits",
    price: 47.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBET_4JYr2O2AvvvRli3TERUUpbH6pxj-7t1GHCLPPG8-vuvWaUJCC6f53bP7AAlOptELPPl94FQUac4asbZIuMgyw-VkBNbN3-AifQXbnXnkxkUfF8KUo3NctWIwPwa622IQ7juCYH65COQK-crTpHxl1nh0Arg4jXpRnUk9lejj53KsvrUXRtCPlXg1szS1qZfy8noCzMzlRxrHo4j_0xw0rDGzU8vC9yXryDgmt42ogMNCdyuuFyQEKGlBG-yARQl5nzs7TA6di",
    category: "Fresh Fruits",
    rating: 4,
    inStock: true,
    description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor.",
    sku: "BG-1027",
    tags: ["Sweet", "Yogurt"],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBr-3dN8qy2Xy4KHEbevWagqJLTMM8se8z0n0IqodFgo74EzGdezNZrcprWOnfZGOHB_ZCmNTwfh_RkHdHkycacG-Zlx7I85ef23EbCozLvNT8RtX-QFEcXhLNCs553Eykag-6uGDX1eOi4p2eW7NK6yuNpH1lNONtBC0jzQl4QyLPCbvNwI0yPIvPzz51zpmSgarx_sEEzEN0dH6L7idYolGUJXL0DQ_-IKpWnjTUdg2grX7bgHM36wJkltdLqBAAE1nepkr41Pwgz",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyM9pfXAvtvXyEARte4EbO_rhBPntjrIsVPEKsawz2BkfWWcEROGn0BaVUQ3MBJc_CQxgtYj1_sdljzZe7HmSVRWs-nFqTH8_jxFBNV2dMF9DUvtrmJnWjMeSID9UTOiD6ULuo7ndy8LtQgX0MTKaQkQGL9b59BHQYmy-NJ01ugZlRsxkds4i21kRu8eRASeBVfv1cqklaxXgCgzBRVqVrNlhZrZhWDdTqb-312pFMK0dH-4OJs3fb3VGOT0FQgVctY1AB0UbvS67_",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9I8J0YM95Qd3tTCtDuELW6E2qjRiaw1wsRt0C5M32olNY5q6rnLWkeH80bKbSvUDGr9b8837E6_hDUcsTKgQIx9UpBSID-65txGGJXBmWl53HnGbviVEhVuUXD8xMfTQGEa7M794NrOv9SEiLMdiJDhgT8ElqGzl2u8PlrSsFJYLku_4MCON878Xr0MaCYLUImdBWfSQ2Qfjn7fcw815LnExElPLAY8R1hZm7ZMr0dQc02R5lw_97_dvUj73WB3Lfh-UchoWw5o2f",
    ],
  },
  {
    id: "12",
    name: "Delicious Lay's Potato Chips",
    slug: "lays-potato-chips",
    price: 12.0,
    originalPrice: 21.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBStj5wumYtkB-D6t0mIZAI_kxWs-CbwGdzvxuDm_mhP8D8nMNW3u4dJL5lJIQPRPJCbCZEvsz_sGMEjQhbgh7FRrfn_ruZ_0tUnWglQXMs2TDZ6Ata661JwHHz2fuffnLHP-lZ60bJyyOfC_rJgWouxucN1_cKYX4OULgtdzoCxaZ7ii6Xk86ZUpC-xOTUxbgYeMwMOtmY2d0jwniBv9LPHEU7YPIAG6p2STHchueO0Igte7XAYI5PPSnrD0T523gFmc4morEd-O9y",
    category: "Frozen Food",
    rating: 5,
    inStock: true,
    discount: 43,
  },
  {
    id: "13",
    name: "SunChips Minis Garden Salsa",
    slug: "sunchips-minis",
    price: 22.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcrufTvGDWR-tq8kEisYSt1bsVvB5lsJQOJpnjt1MtI9mYTlprykPBYcMb4r611Im6mK4U8rS-1Ko6bOxWbGPBCYyLzVA5bHC6c-ACG5FSHu404ytsVH7dJhRdBV4RHAzLH3N6FUjR_gMIRdf95kG3VFta-ghgiitCVIc8o13IvXMHu3f1I9xP0GWv94UgBywZww13J0G-eU7n29XX8DT7XYqyrs-3PXHvMsKC3Z0BglNisKZQ33sULptpZInZC4t6yIBbDZxJTEuv",
    category: "Frozen Food",
    rating: 5,
    inStock: true,
  },
  {
    id: "14",
    name: "Gatorade G Zero Sugar Thirst",
    slug: "gatorade-zero-sugar",
    price: 6.0,
    originalPrice: 12.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ZgENOsGq-iI5vJW53dFzoRYQQA4oQj6mF55Qq8RCmqyEfOEx3_QtPPg6bBbul8iGz9xlYwXnAF7UtXuFmdrMme_E4vIINa6LqTAk7gKNAVS2HbIIwLxT-p-N9o5sbkpGY4SiLpoJfHtVpm0TohS91g81B_7UcBZ-pyVWkjZtCDZPfivATtKPYQc_BWYuNog4dWeXGS_-6PIqXvfwmVbIDEhas40Poh2bjKjX5snvB5FIFUFY_WmjfupLlj20Z-Wo4p6gvPSH5uNt",
    category: "Drinks & Juice",
    rating: 5,
    inStock: true,
    discount: 33,
  },
];

// Fallback functions using static data (for when DB is not configured)
export function getStaticProductBySlug(slug: string): Product | undefined {
  return staticProducts.find((p) => p.slug === slug);
}

export function getStaticProductById(id: string): Product | undefined {
  return staticProducts.find((p) => p.id === id || p.slug === id);
}

export function getStaticHotSaleProducts(): Product[] {
  return staticProducts.filter((p) => p.discount && p.discount > 0).slice(0, 5);
}

export function getStaticFreshVegetables(): Product[] {
  return staticProducts.filter((p) => p.category === "Vegetables" || p.category === "Fresh Fruits").slice(0, 6);
}

export function getStaticFrozenFood(): Product[] {
  return staticProducts.filter((p) => p.category === "Frozen Food" || p.category === "Drinks & Juice").slice(0, 6);
}
