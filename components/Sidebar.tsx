import Link from "next/link";

const categories = [
  { name: "Shop", icon: "storefront", href: "/" },
  { name: "Offers", icon: "local_offer", href: "/offers" },
  { name: "Daily Deals", icon: "watch_later", href: "/deals" },
];

const productCategories = [
  { name: "Beverage", icon: "coffee", count: 8, href: "/category/beverage" },
  { name: "Desserts", icon: "cake", count: 9, href: "/category/desserts" },
  { name: "Drinks & Juice", icon: "local_drink", count: 6, href: "/category/drinks" },
  { name: "Fish & Meats", icon: "set_meal", count: 6, href: "/category/fish-meats" },
  { name: "Fresh Fruits", icon: "apple", count: 8, href: "/category/fruits" },
  { name: "Pets & Animals", icon: "pets", count: 4, href: "/category/pets" },
  { name: "Toys", icon: "toys", count: 3, href: "/category/toys" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <nav
        className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24"
        aria-label="Categories"
      >
        <ul className="flex flex-col py-2">
          {categories.map((item) => (
            <li key={item.name}>
              <Link
                className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                href={item.href}
              >
                <span className="material-icons text-gray-400 text-xl">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          ))}

          <li className="border-t border-gray-100 dark:border-gray-700 my-1" role="separator"></li>

          {productCategories.map((item) => (
            <li key={item.name}>
              <Link
                className="flex items-center justify-between px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition group"
                href={item.href}
              >
                <div className="flex items-center gap-3">
                  <span className="material-icons text-gray-400 group-hover:text-primary text-xl">
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  ({item.count})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
