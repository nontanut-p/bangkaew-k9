"use client";

import Image from "next/image";
import { cn } from "@/lib/demo/cn";
import type { PackAgent, PackAgentState } from "@/lib/demo/pack-agents";
import { packAgentStateMeta } from "@/lib/demo/pack-agents";
import { usePackAgentStatus } from "@/lib/demo/pack-demo-store";
import { PackAgentAlertPopups } from "@/components/demo/PackAgentAlertPopups";

const avatarRing: Record<PackAgentState, string> = {
  working: "agent-ring-working",
  idle: "agent-ring-idle",
  waiting: "agent-ring-waiting",
  unavailable: "agent-ring-unavailable",
};

const avatarMotion: Record<PackAgentState, string> = {
  working: "agent-avatar-working",
  idle: "agent-avatar-idle",
  waiting: "agent-avatar-waiting",
  unavailable: "agent-avatar-unavailable",
};

const sizeMap = {
  sm: "h-11 w-11 rounded-xl",
  md: "h-14 w-14 rounded-xl",
  lg: "h-24 w-24 rounded-2xl",
  hero: "h-full w-full rounded-none",
} as const;

/** Compact avatar — sidebar, small spots */
export function PackAgentAvatar({
  agent,
  size = "md",
}: {
  agent: Pick<PackAgent, "id" | "image" | "name">;
  size?: "sm" | "md" | "lg";
}) {
  const { state } = usePackAgentStatus(agent.id);
  const sizeClass = sizeMap[size];

  return (
    <div className={cn("relative shrink-0", sizeClass)}>
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] ring-2 ring-offset-2 ring-offset-navy-950",
          avatarRing[state]
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[inherit] bg-navy-950/30",
          avatarMotion[state]
        )}
      >
        <Image src={agent.image} alt={agent.name} fill className="object-cover object-top" sizes="80px" />
        {state === "working" && (
          <div className="agent-scan-line pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden />
        )}
        {state === "unavailable" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-navy-950/50">
            <span className="text-sm font-bold text-red-400/90">✕</span>
          </div>
        )}
      </div>
      <StatusDot state={state} size={size} />
    </div>
  );
}

/** Full dog portrait — main Pack HQ cards */
export function PackAgentPortrait({
  agent,
  className,
  showAlertPopups = true,
}: {
  agent: PackAgent;
  className?: string;
  showAlertPopups?: boolean;
}) {
  const { state } = usePackAgentStatus(agent.id);
  const meta = packAgentStateMeta[state];

  return (
    <div className={cn("relative aspect-[4/5] w-full overflow-hidden", className)}>
      {showAlertPopups && <PackAgentAlertPopups agentId={agent.id} />}
      <div
        className={cn(
          "absolute inset-0 z-10 rounded-t-2xl ring-2 ring-inset ring-white/10",
          avatarRing[state]
        )}
        aria-hidden
      />
      <div className={cn("relative h-full w-full", avatarMotion[state])}>
        <Image
          src={agent.image}
          alt={`Agent ${agent.name}`}
          fill
          className="object-cover object-center"
          sizes="(max-width:640px) 50vw, 20vw"
          priority={agent.id === "bangkaew" || agent.id === "shepherd"}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", agent.color)} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
        {state === "working" && (
          <div className="agent-scan-line pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden />
        )}
        {state === "unavailable" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/55 backdrop-blur-[2px]">
            <span className="text-3xl font-bold text-red-400/90">✕</span>
            <span className="mt-1 text-xs font-medium text-red-300">Offline</span>
          </div>
        )}
      </div>

      {/* Name overlay on image */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/90">
              {agent.role}
            </p>
            <p className="text-lg font-bold leading-tight text-white">Agent {agent.name}</p>
          </div>
          <span
            className={cn(
              "mb-1 flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-navy-950/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm",
              state === "working" && "text-emerald-300",
              state === "idle" && "text-slate-300",
              state === "waiting" && "text-amber-300",
              state === "unavailable" && "text-red-300"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
            {meta.label}
          </span>
        </div>
      </div>

      <StatusDot state={state} className="absolute right-3 top-3 z-30 h-3 w-3" />
    </div>
  );
}

function StatusDot({
  state,
  size,
  className,
}: {
  state: PackAgentState;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full ring-2 ring-navy-950",
        packAgentStateMeta[state].dotClass,
        size === "sm" ? "absolute -bottom-0.5 -right-0.5 h-2 w-2" : "h-3 w-3",
        className
      )}
      aria-hidden
    />
  );
}

export function PackAgentStatusLabel({ agentId }: { agentId: PackAgent["id"] }) {
  const st = usePackAgentStatus(agentId);
  const meta = packAgentStateMeta[st.state];

  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block h-2 w-2 rounded-full", meta.dotClass)} aria-hidden />
      <span className={cn("text-xs font-semibold", st.statusColor)}>{st.label}</span>
      {st.state === "working" && <span className="agent-ellipsis text-xs text-slate-500">···</span>}
      {st.state === "waiting" && <span className="agent-wait-bounce text-xs text-amber-400">⏳</span>}
    </div>
  );
}

export function PackAgentStateLegend() {
  const states: PackAgentState[] = ["working", "idle", "waiting", "unavailable"];

  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
      {states.map((state) => {
        const meta = packAgentStateMeta[state];
        return (
          <span
            key={state}
            className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1"
          >
            <span className={cn("h-2 w-2 rounded-full", meta.dotClass)} />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}
