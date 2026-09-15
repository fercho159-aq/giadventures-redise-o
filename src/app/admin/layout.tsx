import { verifySession } from "@/lib/admin/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Adventures GI",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar />
      {/* min-w-0: wide tables/tabs scroll inside their own box instead of widening the page on phones */}
      <main className="flex-1 min-w-0 bg-slate-50 min-h-screen">{children}</main>
    </div>
  );
}
