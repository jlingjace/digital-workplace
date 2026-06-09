import { getAnnouncements } from "@/lib/api";
import { AnnouncementsClient } from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const { data, pagination } = await getAnnouncements({ limit: 100 });

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
      {/* Hero Banner */}
      <div className="bg-primary-container rounded-xl p-10 relative overflow-hidden flex items-center justify-between text-white mb-6">
        <div>
          <span className="bg-surface/20 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-[12px] font-mono mb-4 inline-block">
            Company Announcements
          </span>
          <h1 className="text-[48px] font-bold leading-[56px] -tracking-[0.02em]">Announcements</h1>
          <p className="text-[18px] text-white/90 max-w-xl">
            Official information from leadership, departments, and teams.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-on-primary-container rounded-full blur-3xl opacity-20" />
      </div>

      <AnnouncementsClient initialData={data} total={pagination.total} />
    </div>
  );
}
