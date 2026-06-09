import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Department } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return formatDate(dateStr);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return formatDate(dateStr);
}

export function isExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

export const DEPT_LABELS: Record<Department, string> = {
  ALL: "全公司",
  PEOPLE: "People",
  FINANCE: "财务",
  GTM: "GTM",
  ENGINEERING: "研发",
  IT: "IT",
};

export const DEPT_BADGE_CLASSES: Record<Department, string> = {
  ALL: "bg-gray-100 text-gray-700",
  PEOPLE: "bg-purple-100 text-purple-800",
  FINANCE: "bg-green-100 text-green-800",
  GTM: "bg-orange-100 text-orange-950",
  ENGINEERING: "bg-blue-100 text-blue-800",
  IT: "bg-zinc-100 text-zinc-700",
};

export const DEPARTMENTS: Department[] = [
  "ALL",
  "PEOPLE",
  "FINANCE",
  "GTM",
  "ENGINEERING",
  "IT",
];
