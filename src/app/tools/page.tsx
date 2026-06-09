import { getTools } from "@/lib/api";
import { ToolsClient } from "./ToolsClient";

export default async function ToolsPage() {
  const { data } = await getTools();

  return <ToolsClient initialData={data} />;
}
