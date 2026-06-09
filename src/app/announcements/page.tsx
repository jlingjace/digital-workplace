import { getAnnouncements } from "@/lib/api";
import { AnnouncementsClient } from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const { data, pagination } = await getAnnouncements({ limit: 100 });

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
      <div className="bg-gradient-to-br from-primary-container to-primary rounded-xl p-10 relative overflow-hidden mb-6">
        <span className="bg-white/20 px-3 py-1 rounded-lg text-white text-[12px] font-mono mb-4 inline-block">Company Announcements</span>
        <h1 className="text-[40px] font-bold text-white leading-tight mb-2">Announcements</h1>
        <p className="text-[16px] text-white/90">Official information from leadership, departments, and teams.</p>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>
      <AnnouncementsClient initialData={data} total={pagination.total} />
    </div>
  );
}
