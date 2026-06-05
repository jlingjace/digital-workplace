import { getAnnouncements } from "@/lib/api";
import { AnnouncementsClient } from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const { data, pagination } = await getAnnouncements({ limit: 100 });

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">公告中心</h1>
      <AnnouncementsClient initialData={data} total={pagination.total} />
    </div>
  );
}
