"use client";

import Link from "next/link";
import { cn } from "@/lib/demo/cn";
import type { PackAgent } from "@/lib/demo/pack-agents";
import { usePackAgentStatus } from "@/lib/demo/pack-demo-store";
import { PackAgentAlertPopups } from "@/components/demo/PackAgentAlertPopups";
import { PackAgentPortrait, PackAgentStatusLabel } from "@/components/demo/PackAgentStatus";

export function PackAgentCard({
  agent,
  active,
}: {
  agent: PackAgent;
  active?: boolean;
}) {
  const st = usePackAgentStatus(agent.id);
  const isUnavailable = st.state === "unavailable";

  return (
    <div
      className={cn(
        "group relative glass-card overflow-visible transition-all hover:border-cyan-400/30 hover:shadow-glow",
        active && "ring-2 ring-cyan-400/50",
        agent.borderColor,
        isUnavailable && "opacity-95"
      )}
    >
      <PackAgentAlertPopups agentId={agent.id} />
      <Link href={agent.href} className="block">
        <div className="overflow-hidden rounded-2xl">
          <PackAgentPortrait agent={agent} showAlertPopups={false} />
        </div>
        <div className="border-t border-white/5 p-3">
          <PackAgentStatusLabel agentId={agent.id} />
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{st.task}</p>
          <p className="mt-2 font-mono text-[10px] text-slate-600">{agent.tool}</p>
        </div>
      </Link>
    </div>
  );
}
