import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Video } from "lucide-react";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import LogoutButton from "./LogoutButton";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get("admin_token");

  if (!isAdmin) {
    return <AdminLogin />;
  }
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-dark-bg text-slate-900 dark:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
