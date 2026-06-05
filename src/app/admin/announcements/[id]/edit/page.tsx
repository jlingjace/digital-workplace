import { getAnnouncement } from "@/lib/api";
import { AnnouncementForm } from "../../AnnouncementForm";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function EditAnnouncementPage({ params }: Props) {
  try {
    const { data } = await getAnnouncement(params.id);
    return <AnnouncementForm mode="edit" initial={data} />;
  } catch {
    notFound();
  }
}
