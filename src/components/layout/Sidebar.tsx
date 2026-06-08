"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/announcements", label: "Announcements", icon: "campaign" },
  { href: "/tools", label: "Resources", icon: "build" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Icon name={mobileOpen ? "close" : "menu"} className="text-[20px]" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-[280px] h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col z-50 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand area */}
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg flex-shrink-0">
              <Icon name="corporate_fare" className="text-on-primary text-[20px]" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-primary leading-tight">Corporate Portal</h1>
              <p className="text-[12px] text-on-surface-variant uppercase tracking-wider opacity-70 font-mono">
                Internal Ecosystem
              </p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col mt-2" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 py-3 rounded-lg mb-1 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "border-l-4 border-primary pl-4 bg-primary/10 text-primary font-bold rounded-l-none"
                    : "pl-5 text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                <Icon name={item.icon} className="text-[20px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="mt-auto p-6 border-t border-outline-variant">
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-mono text-sm mb-6 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            <Icon name="add_circle" className="text-[20px]" />
            Submit Request
          </button>
          <div className="flex flex-col gap-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 py-2 pl-3 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <Icon name="settings" className="text-[18px]" />
              Settings
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-3 py-2 pl-3 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <Icon name="help" className="text-[18px]" />
              Support
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
