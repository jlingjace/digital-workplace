"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Announcement, Department } from "@/lib/types";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementSkeletonCard } from "@/components/SkeletonCard";
import { cn, DEPT_LABELS, DEPARTMENTS } from "@/lib/utils";

interface Props {
  initialData: Announcement[];
  total: number;
}

export function AnnouncementsClient({ initialData, total }: Props) {
  const [items] = useState<Announcement[]>(initialData);
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<Department | "">("");
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((a) => {
    const matchesDept = !activeDept || a.department === activeDept;
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div>
      {/* Search + Filter */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索公告标题..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => startTransition(() => setActiveDept(""))}
            className={cn(
              "flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              !activeDept
                ? "bg-primary/10 text-primary/80 border-primary/30"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            )}
          >
            全部
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => startTransition(() => setActiveDept(dept === activeDept ? "" : dept))}
              className={cn(
                "flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                activeDept === dept
                  ? "bg-primary/10 text-primary/80 border-primary/30"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              )}
            >
              {DEPT_LABELS[dept]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-neutral-500 mb-4">
        共 {filtered.length} 条公告{activeDept ? ` · 当前筛选：${DEPT_LABELS[activeDept]}` : " · 当前筛选：全部"}
      </p>

      {isPending ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <AnnouncementSkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Search size={48} className="text-neutral-300 mb-4" />
          <p className="text-lg font-semibold text-neutral-700 mb-1">未找到相关公告</p>
          <p className="text-sm text-neutral-500 mb-4">
            没有匹配 &ldquo;{search}&rdquo; 的公告，请尝试其他关键字或清除筛选条件
          </p>
          <button
            onClick={() => { setSearch(""); setActiveDept(""); }}
            className="text-sm text-primary hover:text-primary/80 border border-primary/30 px-4 py-2 rounded-lg"
          >
            清除搜索
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      )}
    </div>
  );
}
