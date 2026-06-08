"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Announcement, Department } from "@/lib/types";
import { cn, DEPT_LABELS, DEPARTMENTS } from "@/lib/utils";

interface Props {
  initial?: Partial<Announcement>;
  mode: "create" | "edit";
}

export function AnnouncementForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial.title ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [department, setDepartment] = useState<Department>(initial.department ?? "ALL");
  const [authorName, setAuthorName] = useState(initial.authorName ?? "");
  const [authorContact, setAuthorContact] = useState(initial.authorContact ?? "");
  const [expiresAt, setExpiresAt] = useState(
    initial.expiresAt ? initial.expiresAt.substring(0, 10) : ""
  );
  const [isPinned, setIsPinned] = useState(initial.isPinned ?? false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "此项为必填";
    if (!content.trim()) errs.content = "此项为必填";
    if (!authorName.trim()) errs.authorName = "此项为必填";
    return errs;
  }

  function handleSave(publish: boolean) {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      setToast({ type: "success", message: publish ? "公告已发布" : "草稿已保存" });
      setTimeout(() => {
        setToast(null);
        router.push("/admin/announcements");
      }, 2000);
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
        >
          <ChevronLeft size={16} />
          返回
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">
          {mode === "create" ? "新建公告" : "编辑公告"}
        </h1>
      </div>

      {toast && (
        <div
          className={cn(
            "mb-4 px-4 py-3 rounded-lg border text-sm",
            toast.type === "success"
              ? "bg-success-green/10 border-success-green text-success-green"
              : "bg-error-container border-error text-error"
          )}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl bg-white rounded-lg border border-neutral-200 p-6 shadow-card space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            标题 <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
              errors.title
                ? "border-error focus:ring-error"
                : "border-neutral-300 focus:border-primary focus:ring-primary"
            )}
            placeholder="公告标题"
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-xs text-error">{errors.title}</p>
            ) : (
              <span />
            )}
            <p className={cn("text-xs", title.length > 90 ? "text-error" : "text-neutral-400")}>
              {title.length}/100
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            正文 <span className="text-error">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors resize-y",
              errors.content
                ? "border-error focus:ring-error"
                : "border-neutral-300 focus:border-primary focus:ring-primary"
            )}
            placeholder="输入正文内容（支持 HTML）"
          />
          {errors.content && <p className="text-xs text-error mt-1">{errors.content}</p>}
        </div>

        {/* Department + Author */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              发布部门 <span className="text-error">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{DEPT_LABELS[d]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              发布人 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors",
                errors.authorName
                  ? "border-error focus:ring-error"
                  : "border-neutral-300 focus:border-primary focus:ring-primary"
              )}
              placeholder="发布人姓名"
            />
            {errors.authorName && <p className="text-xs text-error mt-1">{errors.authorName}</p>}
          </div>
        </div>

        {/* Contact + ExpiresAt */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">联系方式</label>
            <input
              type="text"
              value={authorContact}
              onChange={(e) => setAuthorContact(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="@slack-handle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">有效期</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* isPinned */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-neutral-700">是否置顶</label>
          <button
            type="button"
            role="switch"
            aria-checked={isPinned}
            onClick={() => setIsPinned(!isPinned)}
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              isPinned ? "bg-primary" : "bg-neutral-300"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                isPinned ? "translate-x-4.5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave(false)}
            className="px-4 py-2 text-sm font-medium border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            保存草稿
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSave(true)}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {isPending ? "保存中..." : "立即发布"}
          </button>
        </div>
      </div>
    </div>
  );
}
