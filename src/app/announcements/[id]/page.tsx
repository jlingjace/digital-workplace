import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, User, MessageSquare } from "lucide-react";
import { getAnnouncement } from "@/lib/api";
import { DepartmentBadge } from "@/components/DepartmentBadge";
import { SafeHtmlContent } from "@/components/SafeHtmlContent";
import { Icon } from "@/components/ui/Icon";
import { formatDate, isExpired } from "@/lib/utils";

interface Props {
  params: { id: string };
}

export default async function AnnouncementDetailPage({ params }: Props) {
  let announcement;
  try {
    const res = await getAnnouncement(params.id);
    announcement = res.data;
  } catch {
    notFound();
  }

  const expired = isExpired(announcement.expiresAt);

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[14px] text-on-surface-variant mb-4" aria-label="Breadcrumb">
        <Link href="/announcements" className="hover:text-primary transition-colors">
          Announcements
        </Link>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="text-on-surface line-clamp-1">{announcement.title}</span>
      </nav>

      {/* Expired banner */}
      {expired && (
        <div className="bg-warning-amber/10 border border-warning-amber text-warning-amber rounded-xl p-4 flex items-center gap-3 mb-6">
          <Icon name="warning" className="text-[20px] shrink-0" />
          <span className="text-[14px] font-medium">
            此公告已于 {formatDate(announcement.expiresAt!)} 过期，内容仅供历史参考
          </span>
        </div>
      )}

      <article className="max-w-3xl mx-auto bg-surface-container-lowest rounded-lg border border-outline-variant p-8 shadow-card">
        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap mb-6">
          <DepartmentBadge
            department={announcement.department}
            className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider"
          />
          <span className="text-[14px] text-on-surface-variant flex items-center gap-1.5">
            <User size={14} />
            {announcement.authorName}
          </span>
          <span className="text-[14px] text-on-surface-variant">
            {formatDate(announcement.publishedAt)}
          </span>
          {announcement.expiresAt && (
            <span className="text-[14px] text-on-surface-variant">
              有效至：{formatDate(announcement.expiresAt)}
            </span>
          )}
          {expired && (
            <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-mono">
              已过期
            </span>
          )}
        </div>

        <h1 className="text-[32px] font-bold text-on-surface mb-6 leading-[1.2]">
          {announcement.title}
        </h1>

        <SafeHtmlContent
          html={announcement.content}
          className="prose prose-neutral max-w-none text-on-surface leading-relaxed"
        />

        {announcement.attachmentUrl && (
          <div className="mt-6 border-t border-outline-variant pt-4">
            <p className="text-sm font-medium text-on-surface mb-2">附件</p>
            <a
              href={announcement.attachmentUrl}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
              download
            >
              <Download size={14} />
              下载附件
            </a>
          </div>
        )}

        {announcement.authorContact && (
          <div className="mt-6 border-t border-outline-variant pt-4">
            <p className="text-sm font-medium text-on-surface mb-2">联系人</p>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {announcement.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={14} />
                {announcement.authorContact}
              </span>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
