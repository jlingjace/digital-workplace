import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const QUICK_ACCESS_ITEMS = [
  { label: "Payroll", icon: "payments", href: "/tools" },
  { label: "Time Off", icon: "beach_access", href: "/tools" },
  { label: "Benefits", icon: "health_and_safety", href: "/tools" },
  { label: "Learning", icon: "school", href: "/tools" },
  { label: "Teams", icon: "group", href: "/tools" },
  { label: "IT Portal", icon: "computer", href: "/tools" },
];

export function QuickAccessGrid() {
  return (
    <section aria-label="Quick access">
      <h2 className="text-[16px] font-bold text-on-surface mb-4 flex items-center gap-2">
        <Icon name="apps" className="text-primary text-[20px]" />
        Quick Access
      </h2>
      <div className="grid grid-cols-3 gap-3" role="list">
        {QUICK_ACCESS_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex flex-col items-center gap-2 py-3 px-2 rounded-xl hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            role="listitem"
            aria-label={item.label}
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary transition-colors">
              <Icon
                name={item.icon}
                className="text-on-surface-variant text-[22px] group-hover:text-on-primary transition-colors"
              />
            </div>
            <span className="text-[12px] font-medium text-on-surface text-center leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
