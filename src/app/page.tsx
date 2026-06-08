import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAnnouncements } from "@/lib/api";
import { AnnouncementCard } from "@/components/AnnouncementCard";

export default async function HomePage() {
  const { data: announcements } = await getAnnouncements({ limit: 5 });

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          欢迎使用 Digital Workplace
        </h1>
        <p className="text-neutral-500 mb-6">公司信息发布中心 · 工具导航</p>
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="搜索公告、工具或 Owner..."
            className="w-full h-12 pl-10 pr-4 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            🔍
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          支持公告标题、工具名称、Owner 姓名搜索
        </p>
      </section>

      {/* Latest Announcements */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">最新公告</h2>
          <Link
            href="/announcements"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            查看全部 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">快速入口</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/announcements"
            className="flex-1 border border-neutral-200 rounded-lg p-4 text-center hover:bg-primary/5 hover:border-primary/20 transition-colors bg-white"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="font-medium text-neutral-800 text-sm">查看所有公告</div>
            <div className="text-xs text-neutral-400 mt-0.5">/announcements</div>
          </Link>
          <Link
            href="/tools"
            className="flex-1 border border-neutral-200 rounded-lg p-4 text-center hover:bg-primary/5 hover:border-primary/20 transition-colors bg-white"
          >
            <div className="text-2xl mb-1">🔧</div>
            <div className="font-medium text-neutral-800 text-sm">工具 & Owner 目录</div>
            <div className="text-xs text-neutral-400 mt-0.5">/tools</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
