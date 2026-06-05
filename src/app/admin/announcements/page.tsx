import Link from "next/link";
import { Plus, Pencil, MoreHorizontal } from "lucide-react";
import { getAllAnnouncementsAdmin } from "@/lib/api";
import { DepartmentBadge } from "@/components/DepartmentBadge";
import { formatDate } from "@/lib/utils";
import { AnnouncementStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: AnnouncementStatus }) {
  const cls = {
    DRAFT: "bg-zinc-100 text-zinc-700",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-red-100 text-red-700",
  }[status];
  const label = { DRAFT: "草稿", PUBLISHED: "已发布", ARCHIVED: "已下架" }[status];
  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cls)}>
      {label}
    </span>
  );
}

export default async function AdminAnnouncementsPage() {
  const { data } = await getAllAnnouncementsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-neutral-900">公告管理</h1>
        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          新建公告
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">标题</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">部门</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">状态</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">发布时间</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <p className="font-medium">暂无公告</p>
                      <p className="text-xs">点击"新建公告"发布第一条公告</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((ann) => (
                  <tr key={ann.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-neutral-900 line-clamp-1">{ann.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <DepartmentBadge department={ann.department} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ann.status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {ann.status === "DRAFT" ? "—" : formatDate(ann.publishedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/announcements/${ann.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-primary-600 px-2 py-1 rounded border border-neutral-200 hover:border-primary-300 transition-colors"
                        >
                          <Pencil size={12} />
                          编辑
                        </Link>
                        <button className="p-1 text-neutral-400 hover:text-neutral-600 rounded">
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
