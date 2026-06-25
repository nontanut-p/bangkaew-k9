import type { PackAgentId } from "./pack-agents";

export type PackReportKind = "detected" | "analysis" | "fix_ready" | "execute_ready" | "status";

export interface PackReport {
  id: string;
  fromAgent: PackAgentId;
  kind: PackReportKind;
  title: string;
  message: string;
  time: string;
}

export type BangkaewItemType = "recommendation" | "approval" | "summary" | "question";

export interface BangkaewInboxItem {
  id: string;
  type: BangkaewItemType;
  title: string;
  message: string;
  time: string;
  sources: PackAgentId[];
  incidentId?: string;
}

export const packReports: PackReport[] = [
  {
    id: "R-01",
    fromAgent: "shepherd",
    kind: "detected",
    title: "Brute Force Detected",
    message: "Wazuh rule 31151 · exec-pc-01 · 185.220.101.42",
    time: "09:15",
  },
  {
    id: "R-02",
    fromAgent: "shepherd",
    kind: "detected",
    title: "Suspicious PowerShell",
    message: "Rule 5710 · it-laptop-02",
    time: "11:32",
  },
  {
    id: "R-03",
    fromAgent: "retriever",
    kind: "fix_ready",
    title: "PR-44 patch ready",
    message: "CVE-2020-8203 · acme/api-service",
    time: "08:00",
  },
  {
    id: "R-04",
    fromAgent: "retriever",
    kind: "analysis",
    title: "3 High code findings",
    message: "Baseline scan · acme/web-app",
    time: "07:30",
  },
  {
    id: "R-05",
    fromAgent: "collie",
    kind: "execute_ready",
    title: "Playbooks armed",
    message: "Block IP + Isolate host ready",
    time: "11:06",
  },
  {
    id: "R-06",
    fromAgent: "pitbull",
    kind: "status",
    title: "Caldera offline",
    message: "Red-team simulation unavailable",
    time: "—",
  },
];

export const bangkaewInbox: BangkaewInboxItem[] = [
  {
    id: "B-01",
    type: "approval",
    title: "Approve Block IP?",
    message: "Brute force from 203.150.10.88 · 47 failed logins on srv-prod-02",
    time: "11:06",
    sources: ["shepherd", "collie"],
    incidentId: "INC-2026-039",
  },
  {
    id: "B-02",
    type: "approval",
    title: "Approve Isolate host?",
    message: "Suspicious PowerShell on it-laptop-02 · INC-2026-041",
    time: "09:25",
    sources: ["shepherd", "collie"],
    incidentId: "INC-2026-041",
  },
  {
    id: "B-03",
    type: "recommendation",
    title: "Merge PR-44 soon?",
    message: "CVE-2020-8203 patch ready · CI passing",
    time: "08:00",
    sources: ["retriever"],
  },
  {
    id: "B-04",
    type: "summary",
    title: "Security posture update",
    message: "Score 84/100 · 3 open incidents · 2 pending approvals",
    time: "11:35",
    sources: ["shepherd", "retriever", "pitbull"],
  },
];

export function getReportsFromAgent(agentId: PackAgentId): PackReport[] {
  return packReports.filter((r) => r.fromAgent === agentId);
}

export function getPendingApprovalCount(): number {
  return bangkaewInbox.filter((i) => i.type === "approval").length;
}

export const reportKindStyle: Record<
  PackReportKind,
  { bg: string; border: string; icon: string; label: string }
> = {
  detected: { bg: "bg-orange-500/90", border: "border-orange-300/40", icon: "🔔", label: "Alert" },
  analysis: { bg: "bg-emerald-600/90", border: "border-emerald-300/40", icon: "📊", label: "Scan" },
  fix_ready: { bg: "bg-emerald-600/90", border: "border-emerald-300/40", icon: "🔧", label: "Fix" },
  execute_ready: { bg: "bg-violet-600/90", border: "border-violet-300/40", icon: "⚡", label: "Ready" },
  status: { bg: "bg-slate-600/90", border: "border-slate-400/40", icon: "📡", label: "Status" },
};

export const inboxTypeStyle: Record<
  BangkaewItemType,
  { bg: string; border: string; icon: string }
> = {
  approval: { bg: "bg-violet-500/95", border: "border-violet-300/50", icon: "✋" },
  recommendation: { bg: "bg-cyan-600/95", border: "border-cyan-300/50", icon: "💡" },
  summary: { bg: "bg-slate-600/95", border: "border-slate-300/50", icon: "📋" },
  question: { bg: "bg-cyan-600/95", border: "border-cyan-300/50", icon: "❓" },
};

export const bangkaewChatStream = [
  { role: "system" as const, from: "shepherd", text: "Brute force on exec-pc-01 from 185.220.101.42" },
  { role: "system" as const, from: "shepherd", text: "Suspicious PowerShell on it-laptop-02" },
  {
    role: "assistant" as const,
    text: "Correlated into INC-2026-039 (High) and INC-2026-041 (Critical). Two items need your approval.",
  },
  { role: "system" as const, from: "retriever", text: "PR-44 ready to merge — patches CVE-2020-8203" },
  {
    role: "assistant" as const,
    text: "I recommend: (1) Block IP 203.150.10.88 (2) Isolate it-laptop-02 (3) Review PR-44",
  },
  { role: "user" as const, text: "Is the system secure right now?" },
  {
    role: "assistant" as const,
    text: "Score 84/100 (Medium). 3 open incidents, 2 pending your approval. Caldera is offline — red-team sim unavailable.",
  },
];
