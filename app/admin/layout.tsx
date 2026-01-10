import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin Dashboard - Orizn Store',
  description: 'Manage your store products',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#121212] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader username={session?.username} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
