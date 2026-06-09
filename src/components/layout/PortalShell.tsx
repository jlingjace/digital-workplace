"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="lg:ml-[280px]">
        <TopHeader />
        <main>{children}</main>
      </div>
    </>
  );
}
