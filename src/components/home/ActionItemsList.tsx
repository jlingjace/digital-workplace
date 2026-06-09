"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface ActionItem {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
}

const MOCK_ACTION_ITEMS: ActionItem[] = [
  { id: "1", title: "Complete 2025 performance self-review", dueDate: "2026-06-10", done: false },
  { id: "2", title: "Submit Q1 expense report", dueDate: "2026-05-31", done: false },
  { id: "3", title: "Review updated GitHub permissions policy", dueDate: "2026-06-15", done: true },
  { id: "4", title: "Complete mandatory security training", dueDate: "2026-06-05", done: false },
];

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ActionItemsList() {
  const [items, setItems] = useState<ActionItem[]>(MOCK_ACTION_ITEMS);
  // Stable reference to avoid SSR/CSR hydration mismatch when comparing dates
  const [now] = useState<Date>(() => new Date());

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const pending = items.filter((i) => !i.done).length;

  return (
    <section aria-label="Action items">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-on-surface flex items-center gap-2">
          <Icon name="checklist" className="text-primary text-[20px]" />
          Action Items
        </h2>
        {pending > 0 && (
          <span className="text-[11px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
            {pending} pending
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const overdue = !item.done && new Date(item.dueDate) < now;
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-lg p-1 -mx-1 hover:bg-surface-container transition-colors"
            >
              {/* Native checkbox hidden, custom-styled label for visual fidelity */}
              <label className="flex items-start gap-3 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggle(item.id)}
                  aria-label={item.title}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                    item.done
                      ? "bg-primary border-primary"
                      : "border-outline-variant group-hover:border-primary"
                  )}
                >
                  {item.done && (
                    <Icon name="check" className="text-on-primary text-[13px]" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-[13px] font-medium leading-tight",
                      item.done && "line-through text-on-surface-variant"
                    )}
                  >
                    {item.title}
                  </p>
                  <time
                    dateTime={item.dueDate}
                    className={cn(
                      "text-[11px] font-mono mt-0.5 block",
                      overdue ? "text-primary font-bold" : "text-on-surface-variant"
                    )}
                  >
                    {overdue ? "Overdue · " : "Due "}
                    {formatShortDate(item.dueDate)}
                  </time>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
