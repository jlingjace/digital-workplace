"use client";

import { useState, useTransition } from "react";
import { Announcement, Department } from "@/lib/types";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementSkeletonCard } from "@/components/SkeletonCard";
import { Icon } from "@/components/ui/Icon";
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
      {/* Search */}
      <div className="mb-4 relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
        <input
          type="text"
          placeholder="搜索公告..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary bg-surface-container-low text-on-surface"
          aria-label="搜索公告"
        />
      </div>

      {/* Department filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        <button
          onClick={() => startTransition(() => setActiveDept(""))}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-mono transition-colors",
            !activeDept
              ? "bg-primary text-on-primary"
              : "bg-surface-container-low text-on-surface hover:bg-surface-container"
          )}
          aria-pressed={!activeDept}
        >
          全部
        </button>
        {DEPARTMENTS.filter((d) => d !== "ALL").map((dept) => (
          <button
            key={dept}
            onClick={() => startTransition(() => setActiveDept(dept === activeDept ? "" : dept))}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-mono transition-colors",
              activeDept === dept
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            )}
            aria-pressed={activeDept === dept}
          >
            {DEPT_LABELS[dept]}
          </button>
        ))}
      </div>

      <p className="text-sm text-on-surface-variant mb-4">
        共 {filtered.length} 条公告
        {activeDept ? ` · ${DEPT_LABELS[activeDept as Department]}` : ""}
      </p>

      {isPending ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <AnnouncementSkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Icon name="search_off" className="text-[48px] text-on-surface-variant/30 mb-4" />
          <p className="text-lg font-semibold text-on-surface mb-1">暂无公告</p>
          <p className="text-sm text-on-surface-variant mb-4">
            未找到与「{search}」相关的公告，请尝试其他关键词或清除筛选条件。
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
