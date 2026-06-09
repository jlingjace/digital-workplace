import Link from "next/link";
import { Pencil, MoreHorizontal } from "lucide-react";
import { getAllAnnouncementsAdmin } from "@/lib/api";
import { DepartmentBadge } from "@/components/DepartmentBadge";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";
import { AnnouncementStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: AnnouncementStatus }) {
  const cls = {
    DRAFT: "bg-surface-container text-on-surface-variant",
    PUBLISHED: "bg-surface-container-low text-success-green border border-success-green/30",
    ARCHIVED: "bg-error-container text-on-error-container",
  }[status];
  const label = { DRAFT: "草稿", PUBLISHED: "已发布", ARCHIVED: "已下架" }[status];
  return (
    <span className={cn("text-xs font-mono px-2 py-0.5 rounded-full", cls)}>
      {label}
    </span>
  );
}

export default async function AdminAnnouncementsPage() {
  const { data } = await getAllAnnouncementsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-on-surface">公告管理</h1>
        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="add" className="text-[16px]" />
          新建公告
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">标题</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">部门</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">状态</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">发布时间</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center gap-2">
                      <Icon name="article" className="text-[40px] text-on-surface-variant/40" />
                      <p className="font-medium">暂无公告</p>
                      <p className="text-xs">点击&ldquo;新建公告&rdquo;发布第一条公告</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((ann) => (
                  <tr key={ann.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-on-surface line-clamp-1">{ann.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <DepartmentBadge department={ann.department} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ann.status} />
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {ann.status === "DRAFT" ? "—" : formatDate(ann.publishedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/announcements/${ann.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary px-2 py-1 rounded border border-outline-variant hover:border-primary/30 transition-colors"
                        >
                          <Pencil size={12} />
                          编辑
                        </Link>
                        <button className="p-1 text-on-surface-variant/60 hover:text-on-surface-variant rounded" aria-label="More actions">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
