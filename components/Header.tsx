"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button className="lg:hidden text-white" aria-label="Open menu">
          <span className="material-icons">menu</span>
        </button>

        <Link href="/" className="flex items-center">
          <Image
            src="/orizn-logo.png"
            alt="Orizn"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
          <form className="flex w-full" role="search">
            <label htmlFor="category-select" className="sr-only">
              Select category
            </label>
            <select
              id="category-select"
              className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-l-md border-r border-gray-300 focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option>All Categories</option>
              <option>Groceries</option>
              <option>Electronics</option>
            </select>
            <label htmlFor="search-input" className="sr-only">
              Search products
            </label>
            <input
              id="search-input"
              className="w-full px-4 py-2 text-gray-700 bg-white border-none focus:ring-0"
              placeholder="Type Your Products ..."
              type="text"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-yellow-400 text-gray-900 font-medium px-6 py-2 rounded-r-md flex items-center transition"
              aria-label="Search"
            >
              <span className="material-icons text-xl">search</span>
            </button>
          </form>
        </div>

        <div className="flex items-center gap-6 text-white">
          <div className="hidden xl:flex flex-col text-xs text-right leading-tight">
            <span className="opacity-80">Call Us Now</span>
            <a href="tel:+9888256666" className="font-bold text-sm hover:underline">
              +9888-256-666
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 hover:bg-green-700/30 px-3 py-1.5 rounded-full transition"
              aria-label="Account"
            >
              <span className="material-icons text-2xl">person_outline</span>
              <span className="hidden md:block text-sm font-medium">
                Accounts
              </span>
            </button>

            <button
              className="relative hover:bg-green-700/30 p-2 rounded-full transition"
              aria-label="Wishlist"
            >
              <span className="material-icons text-2xl">favorite_border</span>
              <span className="absolute top-0 right-0 bg-accent text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            <button
              className="relative hover:bg-green-700/30 p-2 rounded-full transition"
              aria-label="Shopping cart"
            >
              <span className="material-icons text-2xl">shopping_cart</span>
              <span className="absolute top-0 right-0 bg-accent text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
