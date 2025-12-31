import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary pt-12 pb-6 text-white text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between border-b border-green-600 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 border-2 border-dashed border-white rounded-full">
              <span className="material-icons text-3xl">headset_mic</span>
            </div>
            <div>
              <h4 className="font-bold text-lg">Support 24/7</h4>
              <p className="text-xs text-green-100 opacity-80">
                Contact us 24 hours a day
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Image
                src="/orizn-logo.png"
                alt="Orizn"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="mb-4 text-green-100 opacity-80 leading-relaxed">
              Your trusted online grocery store delivering fresh produce and
              quality products to your doorstep.
            </p>
            <address className="space-y-2 text-green-100 not-italic">
              <div className="flex items-start gap-2">
                <span className="material-icons text-sm mt-1">location_on</span>
                <span className="opacity-80">231A Main Road, New York City</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-sm">phone</span>
                <a href="tel:+9888256666" className="opacity-80 hover:opacity-100">
                  +9888-256-666
                </a>
              </div>
            </address>
            <div className="flex gap-2 mt-4">
              <a
                className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center hover:bg-white hover:text-primary transition"
                href="#"
                aria-label="Facebook"
              >
                <span className="material-icons text-sm">facebook</span>
              </a>
              <a
                className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center hover:bg-white hover:text-primary transition"
                href="#"
                aria-label="Twitter"
              >
                <span className="material-icons text-sm">close</span>
              </a>
              <a
                className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center hover:bg-white hover:text-primary transition"
                href="#"
                aria-label="Instagram"
              >
                <span className="material-icons text-sm">camera_alt</span>
              </a>
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-green-100 opacity-80">
              <li>
                <Link className="hover:text-white hover:underline" href="/category/fruits">
                  Fresh Fruits
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/category/vegetables">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/category/dairy">
                  Dairy Products
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/category/beverages">
                  Beverages
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/category/frozen">
                  Frozen Food
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Account links">
            <h3 className="font-bold text-lg mb-4">Accounts</h3>
            <ul className="space-y-2 text-green-100 opacity-80">
              <li>
                <Link className="hover:text-white hover:underline" href="/orders">
                  My Orders
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/checkout">
                  Checkout
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/account">
                  My Account
                </Link>
              </li>
              <li>
                <Link className="hover:text-white hover:underline" href="/wishlist">
                  Wishlist
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-bold text-lg mb-4">Sign Up Newsletter</h3>
            <p className="mb-4 text-green-100 opacity-80 text-xs">
              Subscribe to get special offers and updates on new products.
            </p>
            <form className="flex mb-6">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                className="w-full px-3 py-2 text-gray-700 rounded-l-md border-none focus:ring-0 text-sm"
                placeholder="Type Your E-mail"
                type="email"
                required
              />
              <button
                type="submit"
                className="bg-accent hover:bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-r-md text-sm transition"
              >
                Subscribe
              </button>
            </form>
            <h4 className="font-bold mb-2">Download App on Mobile:</h4>
            <p className="text-xs text-green-100 opacity-80 mb-3">
              15% discount on your first purchase
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="bg-gray-900 hover:bg-gray-800 text-white py-1.5 px-3 rounded flex items-center gap-2 w-36"
              >
                <span className="material-icons text-xl">android</span>
                <div className="text-left leading-none">
                  <span className="text-[8px] block uppercase">Get it on</span>
                  <span className="text-sm font-bold">Google Play</span>
                </div>
              </a>
              <a
                href="#"
                className="bg-gray-900 hover:bg-gray-800 text-white py-1.5 px-3 rounded flex items-center gap-2 w-36"
              >
                <span className="material-icons text-xl">apple</span>
                <div className="text-left leading-none">
                  <span className="text-[8px] block uppercase">Download on</span>
                  <span className="text-sm font-bold">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-green-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-green-100 opacity-70">
            © 2025 Zilly. All Rights Reserved.
          </p>
          <div className="flex gap-2 opacity-80">
            <span className="bg-white rounded px-2 py-1 text-xs text-gray-700">
              Visa
            </span>
            <span className="bg-white rounded px-2 py-1 text-xs text-gray-700">
              Mastercard
            </span>
            <span className="bg-white rounded px-2 py-1 text-xs text-gray-700">
              PayPal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
