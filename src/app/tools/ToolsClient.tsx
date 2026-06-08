"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Tool, Department } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";
import { cn, DEPT_LABELS, DEPARTMENTS } from "@/lib/utils";

interface Props {
  initialData: Tool[];
}

export function ToolsClient({ initialData }: Props) {
  const [search, setSearch] = useState("");

  const filtered = initialData.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.ownerName.toLowerCase().includes(q);
  });

  // Group by department
  const grouped = DEPARTMENTS.reduce<Record<Department, Tool[]>>(
    (acc, dept) => {
      acc[dept] = filtered.filter((t) => t.department === dept);
      return acc;
    },
    {} as Record<Department, Tool[]>
  );

  const hasResults = filtered.length > 0;

  return (
    <div>
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="搜索工具或 Owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
        />
      </div>

      {!hasResults ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-4">🔧</span>
          <p className="text-lg font-semibold text-neutral-700 mb-1">未找到相关工具</p>
          <p className="text-sm text-neutral-500">
            找不到 &ldquo;{search}&rdquo;？可能还未录入。
            <br />
            请联系 IT 团队添加：<a href="mailto:it@company.com" className="text-primary">it@company.com</a>
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {DEPARTMENTS.map((dept) => {
            const tools = grouped[dept];
            if (tools.length === 0) return null;
            return (
              <section key={dept}>
                <h2 className="text-base font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                  <span className={cn(
                    "inline-block w-2 h-2 rounded-full",
                    dept === "ALL" ? "bg-gray-400" :
                    dept === "PEOPLE" ? "bg-purple-400" :
                    dept === "FINANCE" ? "bg-green-400" :
                    dept === "GTM" ? "bg-orange-400" :
                    dept === "ENGINEERING" ? "bg-blue-400" :
                    "bg-zinc-400"
                  )} />
                  {DEPT_LABELS[dept]} 工具
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
