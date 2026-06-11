import { getTools } from "@/lib/api";
import { ToolsClient } from "./ToolsClient";

export default async function ToolsPage() {
  const { data } = await getTools();

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
      <h1 className="text-[32px] font-semibold text-on-surface mb-2">Internal Directory</h1>
      <p className="text-on-surface-variant mb-6">Access all corporate tools, system platforms, and support resources.</p>
      <ToolsClient initialData={data} />
    </div>
  );
}
