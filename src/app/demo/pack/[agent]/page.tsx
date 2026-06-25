import { PackAgentView } from "@/components/demo/views/pack-demo";
import type { PackAgentId } from "@/lib/demo/pack-agents";
import { getPackAgent } from "@/lib/demo/pack-agents";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ agent: string }> }) {
  const { agent } = await params;
  if (!getPackAgent(agent)) notFound();
  return <PackAgentView agentId={agent as PackAgentId} />;
}
