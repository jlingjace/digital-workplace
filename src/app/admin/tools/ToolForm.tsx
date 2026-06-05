"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Tool, Department } from "@/lib/types";
import { cn, DEPT_LABELS, DEPARTMENTS } from "@/lib/utils";

interface Props {
  initial?: Partial<Tool>;
  mode: "create" | "edit";
}

export function ToolForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initial.name ?? "");
  const [url, setUrl] = useState(initial.url ?? "");
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl ?? "");
  const [department, setDepartment] = useState<Department>(initial.department ?? "ALL");
  const [ownerName, setOwnerName] = useState(initial.ownerName ?? "");
  const [ownerEmail, setOwnerEmail] = useState(initial.ownerEmail ?? "");
  const [ownerSlack, setOwnerSlack] = useState(initial.ownerSlack ?? "");
  const [description, setDescription] = useState(initial.description ?? "");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "此项为必填";
    if (!ownerName.trim()) errs.ownerName = "此项为必填";
    if (!ownerEmail.trim()) errs.ownerEmail = "此项为必填";
    if (url && !url.startsWith("https://")) errs.url = "请输入有效的 URL（以 https:// 开头）";
    if (logoUrl && !logoUrl.startsWith("https://")) errs.logoUrl = "请输入有效的 URL（以 https:// 开头）";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      setToast({ type: "success", message: "工具已保存" });
      setTimeout(() => {
        setToast(null);
        router.push("/admin/tools");
      }, 2000);
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/tools"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
        >
          <ChevronLeft size={16} />
          返回
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">
          {mode === "create" ? "新建工具" : "编辑工具"}
        </h1>
      </div>

      {toast && (
        <div className={cn(
          "mb-4 px-4 py-3 rounded-lg border text-sm",
          toast.type === "success"
            ? "bg-success-50 border-success-500 text-success-600"
            : "bg-error-50 border-error-500 text-error-600"
        )}>
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl bg-white rounded-lg border border-neutral-200 p-6 shadow-card space-y-5">
        {/* Name + Department */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              工具名称 <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
                errors.name ? "border-error-500 focus:ring-error-500" : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder="Slack"
            />
            {errors.name && <p className="text-xs text-error-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              所属部门 <span className="text-error-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{DEPT_LABELS[d]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* URL + Logo URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">工具 URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
                errors.url ? "border-error-500 focus:ring-error-500" : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder="https://..."
            />
            {errors.url && <p className="text-xs text-error-600 mt-1">{errors.url}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Logo URL</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
                errors.logoUrl ? "border-error-500 focus:ring-error-500" : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder="https://..."
            />
            {errors.logoUrl && <p className="text-xs text-error-600 mt-1">{errors.logoUrl}</p>}
            {logoUrl && !errors.logoUrl && (
              <img src={logoUrl} alt="logo preview" className="mt-2 w-8 h-8 object-contain" />
            )}
          </div>
        </div>

        {/* Owner Name + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Owner 姓名 <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
                errors.ownerName ? "border-error-500 focus:ring-error-500" : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder="张晓明"
            />
            {errors.ownerName && <p className="text-xs text-error-600 mt-1">{errors.ownerName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Owner Email <span className="text-error-500">*</span>
            </label>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
                errors.ownerEmail ? "border-error-500 focus:ring-error-500" : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder="zhang@company.com"
            />
            {errors.ownerEmail && <p className="text-xs text-error-600 mt-1">{errors.ownerEmail}</p>}
          </div>
        </div>

        {/* Owner Slack */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Owner Slack</label>
          <input
            type="text"
            value={ownerSlack}
            onChange={(e) => setOwnerSlack(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="@username"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            工具简介
            <span className="text-neutral-400 font-normal ml-1">（限 100 字）</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 100))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="一句话简介"
          />
          <p className={cn("text-xs mt-1 text-right", description.length > 90 ? "text-error-600" : "text-neutral-400")}>
            字数：{description.length}/100
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
          <Link
            href="/admin/tools"
            className="px-4 py-2 text-sm font-medium border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "保存中..." : "保存工具"}
          </button>
        </div>
      </div>
    </div>
  );
}
