"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin/announcements", label: "公告管理", icon: FileText },
  { href: "/admin/tools", label: "工具目录", icon: Wrench },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 flex-shrink-0">
      <div className="flex items-center gap-2 mb-4 px-3">
        <LayoutDashboard size={16} className="text-primary" />
        <span className="text-sm font-semibold text-neutral-700">后台管理</span>
      </div>
      <nav className="space-y-1">
        {sidebarItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname?.startsWith(href)
                ? "bg-primary/5 text-primary"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
