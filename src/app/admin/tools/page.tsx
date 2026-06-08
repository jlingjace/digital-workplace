import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAllToolsAdmin } from "@/lib/api";
import { DepartmentBadge } from "@/components/DepartmentBadge";

export default async function AdminToolsPage() {
  const { data } = await getAllToolsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-neutral-900">工具目录管理</h1>
        <Link
          href="/admin/tools/new"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
        >
          <Plus size={16} />
          新建工具
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">工具名</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">部门</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                    暂无工具记录
                  </td>
                </tr>
              ) : (
                data.map((tool) => (
                  <tr key={tool.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{tool.name}</td>
                    <td className="px-4 py-3">
                      <DepartmentBadge department={tool.department} />
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{tool.ownerName}</td>
                    <td className="px-4 py-3 text-neutral-500 truncate max-w-[180px]">
                      <a href={`mailto:${tool.ownerEmail}`} className="hover:text-primary">
                        {tool.ownerEmail}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/tools/${tool.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-primary px-2 py-1 rounded border border-neutral-200 hover:border-primary/30 transition-colors"
                        >
                          <Pencil size={12} />
                          编辑
                        </Link>
                        <button className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors">
                          <Trash2 size={14} />
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
