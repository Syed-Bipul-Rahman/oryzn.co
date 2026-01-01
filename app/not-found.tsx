"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated Shopping Cart */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-black text-gray-100 dark:text-gray-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              <div className="relative">
                {/* Cart Body */}
                <div className="w-32 h-24 bg-primary rounded-lg relative overflow-hidden shadow-xl transform -rotate-6 animate-wiggle">
                  {/* Cart Items popping out */}
                  <div className="absolute -top-4 left-2 text-3xl animate-float-slow">🥕</div>
                  <div className="absolute -top-6 left-10 text-2xl animate-float-medium">🍎</div>
                  <div className="absolute -top-3 right-4 text-3xl animate-float-fast">🥦</div>
                  <div className="absolute -top-5 right-10 text-2xl animate-float-slow">🍋</div>

                  {/* Question marks */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-4xl font-bold animate-pulse">
                    ?
                  </div>
                </div>

                {/* Cart Wheels */}
                <div className="absolute -bottom-3 left-4 w-6 h-6 bg-gray-700 rounded-full border-4 border-gray-500 animate-spin-slow"></div>
                <div className="absolute -bottom-3 right-4 w-6 h-6 bg-gray-700 rounded-full border-4 border-gray-500 animate-spin-slow"></div>

                {/* Cart Handle */}
                <div className="absolute -right-8 top-2 w-8 h-3 bg-gray-600 rounded-r-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Humorous Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! This aisle doesn&apos;t exist!
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
          Looks like this page went shopping and never came back...
        </p>

        <p className="text-gray-500 dark:text-gray-400 mb-8 italic">
          Maybe it&apos;s hiding behind the bananas? 🍌
        </p>

        {/* Fun Stats */}
        <div className="flex justify-center gap-8 mb-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span>Search attempts: 404</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span>Carts lost: Many</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="material-icons">home</span>
            Back to Store
          </Link>

          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
          >
            <span className="material-icons">arrow_back</span>
            Go Back
          </button>
        </div>

        {/* Floating Groceries Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 text-4xl animate-float-slow opacity-20">🥬</div>
          <div className="absolute top-40 right-20 text-5xl animate-float-medium opacity-20">🍊</div>
          <div className="absolute bottom-40 left-20 text-4xl animate-float-fast opacity-20">🥑</div>
          <div className="absolute bottom-20 right-10 text-5xl animate-float-slow opacity-20">🍇</div>
          <div className="absolute top-60 left-1/4 text-3xl animate-float-medium opacity-20">🧅</div>
          <div className="absolute bottom-60 right-1/4 text-4xl animate-float-fast opacity-20">🍓</div>
        </div>

        {/* Easter Egg */}
        <p className="mt-12 text-xs text-gray-400 dark:text-gray-600">
          Pro tip: The vegetables section is in Aisle 3 🥗
        </p>
      </div>
    </div>
  );
}
