import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getAnnouncement } from "@/lib/api";
import { DepartmentBadge } from "@/components/DepartmentBadge";
import { SafeHtmlContent } from "@/components/SafeHtmlContent";
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
      <Link
        href="/announcements"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface mb-6"
      >
        <Icon name="chevron_left" className="text-[18px]" />
        返回公告列表
      </Link>

      {expired && (
        <div className="flex items-center gap-2 w-full bg-warning-amber/10 border border-warning-amber text-warning-amber rounded-xl px-4 py-3 mb-6 text-sm">
          <Icon name="warning" className="flex-shrink-0 text-[16px]" />
          <span>
            此公告已于 {formatDate(announcement.expiresAt!)} 过期，内容仅供历史参考
          </span>
        </div>
      )}

      <article className="max-w-3xl mx-auto bg-surface-container-lowest rounded-lg border border-outline-variant p-8">
        <div className="mb-4 flex items-center gap-2">
          <DepartmentBadge department={announcement.department} />
        </div>

        <h1 className="text-3xl font-bold text-on-surface mb-4">
          {announcement.title}
        </h1>

        <div className="border-y border-outline-variant py-3 mb-6 flex flex-wrap gap-4 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Icon name="person" className="text-[14px]" />
            {announcement.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="calendar_today" className="text-[14px]" />
            {formatDate(announcement.publishedAt)}
          </span>
          {announcement.expiresAt && (
            <span className="flex items-center gap-1.5">
              <Icon name="calendar_today" className="text-[14px]" />
              有效至：{formatDate(announcement.expiresAt)}
            </span>
          )}
        </div>

        <SafeHtmlContent
          html={announcement.content}
          className="prose prose-neutral max-w-none text-on-surface leading-relaxed"
        />

        {announcement.attachmentUrl && (
          <div className="mt-6 border-t border-outline-variant pt-4">
            <p className="text-sm font-medium text-on-surface mb-2">
              <Icon name="attach_file" className="inline text-[14px] mr-1" />
              附件
            </p>
            <a
              href={announcement.attachmentUrl}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
              download
            >
              <Icon name="download" className="text-[14px]" />
              下载附件
            </a>
          </div>
        )}

        {announcement.authorContact && (
          <div className="mt-6 border-t border-outline-variant pt-4">
            <p className="text-sm font-medium text-on-surface mb-2">联系人</p>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <Icon name="person" className="text-[14px]" />
                {announcement.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="chat" className="text-[14px]" />
                {announcement.authorContact}
              </span>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
