import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnnouncements } from "@/lib/api";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { AnnouncementsFeed } from "@/components/home/AnnouncementsFeed";
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid";
import { ActionItemsList } from "@/components/home/ActionItemsList";
import { UpcomingEventsCard } from "@/components/home/UpcomingEventsCard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name?.split(" ")[0] ?? "Employee";

  const { data: announcements } = await getAnnouncements({ limit: 3 });

  return (
    <div className="max-w-content mx-auto px-4 lg:px-8 py-6 lg:py-10 flex flex-col gap-6">
      {/* Orange Welcome Banner */}
      {/* TODO: wire pendingCount/urgentCount to /api/me/stats once endpoint is available (see sub-issue) */}
      <WelcomeBanner userName={userName} pendingCount={3} urgentCount={1} />

      {/* 12-col Bento Grid: left 8 / right 4 */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card">
            <AnnouncementsFeed announcements={announcements} />
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
            <QuickAccessGrid />
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
            <ActionItemsList />
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
            <UpcomingEventsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
