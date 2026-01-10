'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: 'inventory_2',
  },
  {
    name: 'View Store',
    href: '/',
    icon: 'storefront',
    external: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#181818] border-r border-gray-800 min-h-screen">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="material-icons text-[#e53935]">admin_panel_settings</span>
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                target={item.external ? '_blank' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#e53935] text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                <span>{item.name}</span>
                {item.external && (
                  <span className="material-icons text-sm ml-auto">open_in_new</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
