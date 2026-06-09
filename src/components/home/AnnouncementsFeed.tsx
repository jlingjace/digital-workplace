import Link from "next/link";
import { Announcement } from "@/lib/types";
import { DepartmentBadge } from "@/components/DepartmentBadge";
import { cn, formatDate } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface Props {
  announcements: Announcement[];
}

function getBorderClass(department: Announcement["department"]): string {
  return department === "IT"
    ? "border-l-4 border-l-tertiary-container"
    : "border-l-4 border-l-primary";
}

export function AnnouncementsFeed({ announcements }: Props) {
  return (
    <section aria-label="Latest announcements">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-on-surface flex items-center gap-2">
          <Icon name="campaign" className="text-primary text-[22px]" />
          Announcements
        </h2>
        <Link
          href="/announcements"
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium transition-colors"
        >
          View all
          <Icon name="chevron_right" className="text-[18px]" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {announcements.length === 0 && (
          <p className="text-on-surface-variant text-sm py-4">No announcements available.</p>
        )}
        {announcements.map((ann) => (
          <Link key={ann.id} href={`/announcements/${ann.id}`} className="block group">
            <article
              className={cn(
                "bg-surface-container-lowest rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200",
                getBorderClass(ann.department)
              )}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <DepartmentBadge department={ann.department} />
                <time
                  dateTime={ann.publishedAt}
                  className="text-[12px] text-on-surface-variant font-mono flex-shrink-0"
                >
                  {formatDate(ann.publishedAt)}
                </time>
              </div>
              <h3 className="font-semibold text-on-surface text-[14px] line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {ann.title}
              </h3>
              <p className="text-[13px] text-on-surface-variant line-clamp-2 leading-relaxed">
                {ann.content.replace(/<[^>]*>/g, "")}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
