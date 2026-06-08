"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const quickLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/benefits", label: "Benefits" },
  { href: "/policies", label: "Policies" },
  { href: "/support", label: "IT Support" },
];

export function TopHeader() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="h-16 bg-surface border-b border-outline-variant sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="relative flex-1 max-w-xl">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          placeholder="Search Portal..."
          aria-label="Search portal"
        />
      </div>

      {/* Center: Quick links (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-10 ml-6" aria-label="Quick links">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors whitespace-nowrap",
              pathname?.startsWith(link.href)
                ? "text-primary font-bold border-b-2 border-primary pb-1"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notification bell with badge */}
        <button
          className="relative p-1 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-[24px]" />
          <span
            className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-container rounded-full"
            aria-hidden="true"
          />
        </button>

        {/* Apps grid */}
        <button
          className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Apps"
        >
          <Icon name="apps" className="text-[24px]" />
        </button>

        {/* User avatar */}
        <button
          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden"
          aria-label="User profile"
        >
          <Icon name="person" className="text-primary text-[20px]" />
        </button>
      </div>
    </header>
  );
}
