"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: "/announcements", label: "公告" },
    { href: "/tools", label: "工具目录" },
  ];

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-neutral-200 flex items-center px-6">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
          DW
        </div>
        <Link href="/" className="font-semibold text-neutral-900 text-sm hidden sm:block">
          Digital Workplace
        </Link>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6 ml-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors",
              pathname?.startsWith(link.href)
                ? "text-primary"
                : "text-neutral-600 hover:text-neutral-900"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {searchOpen ? (
          <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            <input
              autoFocus
              type="text"
              placeholder="搜索公告、工具或 Owner..."
              className="text-sm px-3 py-1.5 outline-none w-56"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="打开搜索"
          >
            <Search size={18} />
          </button>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-neutral-200 px-6 py-4 flex flex-col gap-4 md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium",
                pathname?.startsWith(link.href) ? "text-primary" : "text-neutral-700"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
