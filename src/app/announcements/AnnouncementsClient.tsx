"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
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
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" />
          <input
            type="text"
            placeholder="搜索公告标题..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => startTransition(() => setActiveDept(""))}
            className={cn(
              "flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              !activeDept
                ? "bg-primary text-on-primary border-transparent"
                : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container"
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
                  ? "bg-primary text-on-primary border-transparent"
                  : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container"
              )}
            >
              {DEPT_LABELS[dept]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-on-surface-variant mb-4">
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
          <Icon name="search" className="text-outline-variant text-[48px] mb-4" />
          <p className="text-lg font-semibold text-on-surface mb-1">未找到相关公告</p>
          <p className="text-sm text-on-surface-variant mb-4">
            没有匹配 &ldquo;{search}&rdquo; 的公告，请尝试其他关键字或清除筛选条件
          </p>
          <button
            onClick={() => { setSearch(""); setActiveDept(""); }}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm"
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
