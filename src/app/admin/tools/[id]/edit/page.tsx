import { getAllToolsAdmin } from "@/lib/api";
import { ToolForm } from "../../ToolForm";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function EditToolPage({ params }: Props) {
  const { data } = await getAllToolsAdmin();
  const tool = data.find((t) => t.id === params.id);
  if (!tool) notFound();
  return <ToolForm mode="edit" initial={tool} />;
}
