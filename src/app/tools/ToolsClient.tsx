"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Tool, Department } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";
import { cn, DEPT_LABELS, DEPARTMENTS } from "@/lib/utils";

interface Props {
  initialData: Tool[];
}

const TAB_LABELS: Record<Department, string> = {
  ALL: "All Systems",
  IT: "IT",
  ENGINEERING: "Engineering",
  GTM: "GTM",
  PEOPLE: "People",
  FINANCE: "Finance",
};

const TAB_ORDER: Department[] = ["ALL", "IT", "ENGINEERING", "GTM", "PEOPLE", "FINANCE"];

export function ToolsClient({ initialData }: Props) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Department>("ALL");

  const filtered = initialData.filter((t) => {
    const matchesDept = activeTab === "ALL" || t.department === activeTab;
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.ownerName.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const hasResults = filtered.length > 0;

  return (
    <div>
      {/* Department Tab Filter Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5">
        {TAB_ORDER.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveTab(dept)}
            className={cn(
              "flex-shrink-0 px-4 py-2 text-xs font-mono font-medium rounded-full transition-colors",
              activeTab === dept
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            )}
          >
            {TAB_LABELS[dept]}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" />
        <input
          type="text"
          placeholder="Search tools or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest"
        />
      </div>

      {!hasResults ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-4">🔧</span>
          <p className="text-lg font-semibold text-on-surface mb-1">No tools found</p>
          <p className="text-sm text-on-surface-variant">
            Can&apos;t find &ldquo;{search}&rdquo;? It may not be listed yet.
            <br />
            Contact IT to add it: <a href="mailto:it@company.com" className="text-primary">it@company.com</a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
