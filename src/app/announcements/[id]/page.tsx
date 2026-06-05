import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, Calendar, Download, User, MessageSquare } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { getAnnouncement } from "@/lib/api";
import { DepartmentBadge } from "@/components/DepartmentBadge";
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
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
      >
        <ChevronLeft size={16} />
        返回公告列表
      </Link>

      {expired && (
        <div className="flex items-center gap-2 w-full bg-warning-50 border border-warning-500 text-warning-600 rounded-lg px-4 py-3 mb-6 text-sm">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>
            此公告已于 {formatDate(announcement.expiresAt!)} 过期，内容仅供历史参考
          </span>
        </div>
      )}

      <article className="max-w-3xl mx-auto bg-white rounded-lg border border-neutral-200 p-8 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <DepartmentBadge department={announcement.department} />
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          {announcement.title}
        </h1>

        <div className="border-y border-neutral-100 py-3 mb-6 flex flex-wrap gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            {announcement.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(announcement.publishedAt)}
          </span>
          {announcement.expiresAt && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              有效至：{formatDate(announcement.expiresAt)}
            </span>
          )}
        </div>

        <div
          className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
        />

        {announcement.attachmentUrl && (
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm font-medium text-neutral-700 mb-2">📎 附件</p>
            <a
              href={announcement.attachmentUrl}
              className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700"
              download
            >
              <Download size={14} />
              下载附件
            </a>
          </div>
        )}

        {announcement.authorContact && (
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-sm font-medium text-neutral-700 mb-2">联系人</p>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
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
