import Link from "next/link";
import { Calendar } from "lucide-react";
import { Announcement } from "@/lib/types";
import { DepartmentBadge } from "./DepartmentBadge";
import { Icon } from "@/components/ui/Icon";
import { cn, formatDate, isExpired } from "@/lib/utils";

interface Props {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: Props) {
  const expired = isExpired(announcement.expiresAt);

  return (
    <Link href={`/announcements/${announcement.id}`}>
      <article
        className={cn(
          "relative bg-white rounded-md border border-neutral-200 p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer",
          announcement.isPinned && "border-l-4 border-l-primary bg-primary/5",
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
        <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2 mb-2">
          {announcement.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>{announcement.authorName}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
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
