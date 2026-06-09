import Link from "next/link";
import { Announcement } from "@/lib/types";
import { DepartmentBadge } from "./DepartmentBadge";
import { Icon } from "@/components/ui/Icon";
import { cn, formatTimeAgo, isExpired } from "@/lib/utils";

interface Props {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: Props) {
  const expired = isExpired(announcement.expiresAt);
  const excerpt = announcement.content.replace(/<[^>]*>/g, "").trim().slice(0, 120);

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
        aria-label={announcement.title}
      >
        {announcement.isPinned && (
          <Icon name="push_pin" className="absolute top-3 right-3 text-primary text-[14px]" />
        )}
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
            已过期
          </span>
        )}
        <p className="text-[16px] text-on-surface-variant line-clamp-2">
          {excerpt}
        </p>
        <p className="text-[14px] text-on-surface-variant/70 mt-2">
          {announcement.authorName}
        </p>
      </article>
    </Link>
  );
}
