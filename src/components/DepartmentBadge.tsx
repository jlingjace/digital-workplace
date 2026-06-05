"use client";

import { Department } from "@/lib/types";
import { cn, DEPT_BADGE_CLASSES, DEPT_LABELS } from "@/lib/utils";

interface Props {
  department: Department;
  className?: string;
}

export function DepartmentBadge({ department, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
        DEPT_BADGE_CLASSES[department],
        className
      )}
    >
      {DEPT_LABELS[department]}
    </span>
  );
}
