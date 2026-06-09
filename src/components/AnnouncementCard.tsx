import Link from "next/link";
import { Announcement } from "@/lib/types";
import { DepartmentBadge } from "./DepartmentBadge";
import { Icon } from "@/components/ui/Icon";
import { cn, formatDate, isExpired } from "@/lib/utils";

interface Props {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: Props) {
  const expired = isExpired(announcement.expiresAt);

  const borderClass = announcement.isPinned
    ? "border-l-4 border-l-primary bg-primary/5"
    : announcement.department === "IT"
    ? "border-l-4 border-l-tertiary"
    : "border-l-4 border-l-outline-variant";

  return (
    <Link href={`/announcements/${announcement.id}`}>
      <article
        className={cn(
          "relative bg-surface-container-lowest rounded-lg border border-outline-variant p-5 hover:bg-surface-container transition-colors cursor-pointer group",
          borderClass,
          expired && "opacity-60"
        )}
      >
        {announcement.isPinned && (
          <Icon name="push_pin" className="absolute top-3 right-3 text-primary text-[14px]" />
        )}
        {expired && (
          <span className="absolute top-3 right-3 text-xs bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
            已过期
          </span>
        )}
        <div className="flex items-start gap-2 mb-2">
          <DepartmentBadge department={announcement.department} />
        </div>
        <h3 className="font-semibold text-on-surface text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {announcement.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span>{announcement.authorName}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Icon name="calendar_today" className="text-[11px]" />
            {formatDate(announcement.publishedAt)}
          </span>
          {announcement.expiresAt && !expired && (
            <>
              <span>·</span>
              <span>有效期至 {formatDate(announcement.expiresAt)}</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
