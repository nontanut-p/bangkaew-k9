export type PackAgentId = "shepherd" | "bangkaew" | "retriever" | "collie" | "pitbull";

export type PackAgentState = "working" | "idle" | "waiting" | "unavailable";

export interface PackAgentStatus {
  state: PackAgentState;
  label: string;
  task: string;
  statusColor: string;
}

export interface PackAgent {
  id: PackAgentId;
  name: string;
  role: string;
  tool: string;
  image: string;
  color: string;
  borderColor: string;
  tagline: string;
  href: string;
}

export const packAgents: PackAgent[] = [
  {
    id: "shepherd",
    name: "Shepherd",
    role: "Watchdog",
    tool: "Wazuh",
    image: "/pack/shepherd.png",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/40",
    tagline: "Detects threats across endpoints and logs",
    href: "/demo/pack/shepherd",
  },
  {
    id: "bangkaew",
    name: "Bangkaew",
    role: "Pack Leader",
    tool: "Agentic AI",
    image: "/pack/bangkaew.png",
    color: "from-cyan-500 to-teal-500",
    borderColor: "border-cyan-500/40",
    tagline: "Analyzes, correlates, and recommends actions",
    href: "/demo/pack/bangkaew",
  },
  {
    id: "retriever",
    name: "Retriever",
    role: "Fixer",
    tool: "GitHub + Semgrep / Trivy",
    image: "/pack/retriever.png",
    color: "from-emerald-500 to-green-500",
    borderColor: "border-emerald-500/40",
    tagline: "Scans code and opens fix pull requests",
    href: "/demo/pack/retriever",
  },
  {
    id: "collie",
    name: "Collie",
    role: "Handler",
    tool: "Shuffle",
    image: "/pack/collie.png",
    color: "from-violet-500 to-purple-500",
    borderColor: "border-violet-500/40",
    tagline: "Runs playbooks — block, isolate, notify",
    href: "/demo/pack/collie",
  },
  {
    id: "pitbull",
    name: "Pitbull",
    role: "Sparring Dog",
    tool: "Kali / Caldera",
    image: "/pack/pitbull.png",
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/40",
    tagline: "Simulates attacks to validate defenses",
    href: "/demo/pack/pitbull",
  },
];

export function getPackAgent(id: string): PackAgent | undefined {
  return packAgents.find((a) => a.id === id);
}

export const packAgentStatus: Record<PackAgentId, PackAgentStatus> = {
  shepherd: {
    state: "working",
    label: "Working",
    task: "Monitoring 10 endpoints",
    statusColor: "text-blue-400",
  },
  bangkaew: {
    state: "working",
    label: "Working",
    task: "INC-2026-039 — correlating alerts",
    statusColor: "text-cyan-400",
  },
  retriever: {
    state: "idle",
    label: "Idle",
    task: "Awaiting assignment",
    statusColor: "text-emerald-400",
  },
  collie: {
    state: "working",
    label: "Working",
    task: "Playbooks armed — standing by",
    statusColor: "text-violet-400",
  },
  pitbull: {
    state: "unavailable",
    label: "Unavailable",
    task: "Caldera not connected",
    statusColor: "text-red-400",
  },
};

export const packAgentStateMeta: Record<
  PackAgentState,
  { label: string; dotClass: string }
> = {
  working: { label: "Working", dotClass: "agent-dot-working" },
  idle: { label: "Idle", dotClass: "agent-dot-idle" },
  waiting: { label: "Waiting", dotClass: "agent-dot-waiting" },
  unavailable: { label: "Unavailable", dotClass: "agent-dot-unavailable" },
};
