"use client";

import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Settings, Video, FileEdit, Calculator } from "lucide-react";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/admin/lessons", label: "الدروس والمحاضرات", icon: Video },
    { href: "/admin/subjects", label: "المواد والتخصصات", icon: BookOpen },
    { href: "/admin/users", label: "المستخدمين", icon: Users },
    { href: "/admin/gpa", label: "حاسبة المعدل", icon: Calculator },
    { href: "/admin/posts", label: "المنشورات (تعديل/حذف)", icon: FileEdit },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-l border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-medical-600 dark:text-medical-400">لوحة التحكم</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive 
                  ? "bg-medical-600 text-white shadow-md shadow-medical-600/20" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-medical-600 dark:hover:text-medical-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-medical-600 dark:group-hover:text-medical-400"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <LogoutButton />
      </div>
    </aside>
  );
}
