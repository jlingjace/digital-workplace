import Link from "next/link";
import { Announcement } from "@/lib/types";
import { DepartmentBadge } from "./DepartmentBadge";
import { cn, formatTimeAgo, isExpired } from "@/lib/utils";

interface Props {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: Props) {
  const expired = isExpired(announcement.expiresAt);

  return (
    <Link href={`/announcements/${announcement.id}`}>
      <article
        className={cn(
          "bg-surface-container-low p-6 rounded-lg",
          "border-l-4",
          announcement.isPinned ? "border-primary" : "border-tertiary-container",
          "hover:bg-surface-container transition-colors cursor-pointer group",
          expired && "opacity-60"
        )}
        aria-label={announcement.title}
      >
        <div className="flex justify-between items-start mb-2">
          <DepartmentBadge
            department={announcement.department}
            className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider"
          />
          <span className="text-[14px] text-on-surface-variant shrink-0 ml-4">
            {formatTimeAgo(announcement.publishedAt)}
          </span>
        </div>
        <h4 className="text-[18px] font-semibold mb-2 group-hover:text-primary transition-colors text-on-surface">
          {announcement.title}
        </h4>
        {expired && (
          <span className="inline-block text-[10px] bg-error-container text-on-error-container px-3 py-1 rounded-full font-mono mb-2">
            Expired
          </span>
        )}
        <p className="text-[16px] text-on-surface-variant line-clamp-2">
          {announcement.authorName}
        </p>
      </article>
    </Link>
  );
}
