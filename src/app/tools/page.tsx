import { getTools } from "@/lib/api";
import { ToolsClient } from "./ToolsClient";

export default async function ToolsPage() {
  const { data } = await getTools();

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">工具 & Owner 目录</h1>
      <p className="text-sm text-neutral-500 mb-6">公司所有 SaaS 工具及对应负责人</p>
      <ToolsClient initialData={data} />
    </div>
  );
}
