export type ShuffleModuleStatus = "active" | "partial" | "disabled";

export interface ShuffleMetric {
  label: string;
  value: string;
  status?: "ok" | "warn" | "critical";
}

export type CollieReportKind = "approval_request" | "status" | "execution" | "audit";

export interface CollieBangkaewReport {
  id: string;
  time: string;
  kind: CollieReportKind;
  title: string;
  detail: string;
  severity?: "low" | "medium" | "high" | "critical";
  acknowledged?: boolean;
}

export interface ShuffleModule {
  id: string;
  name: string;
  shortName: string;
  category: "Response" | "Communication" | "Orchestration" | "Integration" | "Governance";
  status: ShuffleModuleStatus;
  icon: string;
  capability: string;
  scope: string[];
  metrics: ShuffleMetric[];
  playbooks: string[];
  lastReport?: CollieBangkaewReport;
}

/** 16 of 20 Shuffle capabilities enabled for security SOAR (~80%) */
export const shuffleModules: ShuffleModule[] = [
  {
    id: "playbooks",
    name: "Playbook Orchestration",
    shortName: "Playbooks",
    category: "Orchestration",
    status: "active",
    icon: "⚡",
    capability: "Chain security actions into repeatable incident response playbooks",
    scope: ["12 playbooks", "5 armed", "Bangkaew gate"],
    metrics: [
      { label: "Armed", value: "5", status: "ok" },
      { label: "Pending approval", value: "2", status: "warn" },
      { label: "Runs today", value: "3", status: "ok" },
    ],
    playbooks: ["Block IP", "Isolate Host", "Notify Admin", "Collect Evidence", "Open Ticket"],
    lastReport: {
      id: "CR-01",
      time: "11:06",
      kind: "approval_request",
      title: "Block IP playbook queued",
      detail: "203.150.10.88 · INC-2026-039 · awaiting Bangkaew",
      severity: "medium",
    },
  },
  {
    id: "incident-flows",
    name: "Incident Response Workflows",
    shortName: "IR Flows",
    category: "Orchestration",
    status: "active",
    icon: "🚨",
    capability: "Multi-step IR flows triggered from Wazuh alerts via Bangkaew",
    scope: ["4 active flows", "Wazuh webhook", "Auto-triage"],
    metrics: [
      { label: "Open incidents", value: "3", status: "warn" },
      { label: "Avg MTTR", value: "3m 24s", status: "ok" },
      { label: "Flows run", value: "7/wk", status: "ok" },
    ],
    playbooks: ["Brute Force IR", "Malware IR", "Data Exfil IR", "CVE Response"],
    lastReport: {
      id: "CR-02",
      time: "09:25",
      kind: "approval_request",
      title: "Isolate host requested",
      detail: "it-laptop-02 · INC-2026-041 · pending Bangkaew",
      severity: "high",
    },
  },
  {
    id: "firewall",
    name: "Block IP / Firewall",
    shortName: "Firewall",
    category: "Response",
    status: "active",
    icon: "🧱",
    capability: "Push deny rules to perimeter firewall and cloud SGs",
    scope: ["FortiGate", "AWS SG", "24h TTL default"],
    metrics: [
      { label: "Rules active", value: "14", status: "ok" },
      { label: "Queued", value: "1", status: "warn" },
      { label: "Last block", value: "02:06", status: "ok" },
    ],
    playbooks: ["Block IP", "Unblock IP", "Geo-block"],
    lastReport: {
      id: "CR-03",
      time: "11:06",
      kind: "approval_request",
      title: "Block 203.150.10.88",
      detail: "FortiGate + AWS SG · needs Bangkaew approval",
      severity: "medium",
    },
  },
  {
    id: "edr",
    name: "Isolate Host / EDR",
    shortName: "EDR",
    category: "Response",
    status: "active",
    icon: "🔒",
    capability: "Network isolate endpoints via EDR and VLAN quarantine",
    scope: ["Wazuh active response", "VLAN quarantine"],
    metrics: [
      { label: "Isolated now", value: "0", status: "ok" },
      { label: "Pending", value: "1", status: "warn" },
      { label: "Max duration", value: "4h auto-release", status: "ok" },
    ],
    playbooks: ["Isolate Host", "Release Host", "Kill Process"],
    lastReport: {
      id: "CR-04",
      time: "09:25",
      kind: "approval_request",
      title: "Isolate it-laptop-02",
      detail: "Suspicious PowerShell · INC-2026-041",
      severity: "high",
    },
  },
  {
    id: "notify",
    name: "Notify & Escalate",
    shortName: "Notify",
    category: "Communication",
    status: "active",
    icon: "📣",
    capability: "Email, LINE, Slack, and SMS escalation paths",
    scope: ["Email", "LINE Notify", "Slack #soc"],
    metrics: [
      { label: "Sent today", value: "6", status: "ok" },
      { label: "Queued", value: "0", status: "ok" },
      { label: "On-call", value: "Somchai", status: "ok" },
    ],
    playbooks: ["Notify Admin", "Escalate L2", "Executive Brief"],
  },
  {
    id: "tickets",
    name: "Ticket Management",
    shortName: "Tickets",
    category: "Communication",
    status: "active",
    icon: "🎫",
    capability: "Create and update Jira / ServiceNow tickets from incidents",
    scope: ["Jira SOC project", "ServiceNow ITSM"],
    metrics: [
      { label: "Open tickets", value: "4", status: "ok" },
      { label: "Auto-created", value: "2 today", status: "ok" },
      { label: "SLA breach", value: "0", status: "ok" },
    ],
    playbooks: ["Open Ticket", "Update Ticket", "Close Ticket"],
  },
  {
    id: "evidence",
    name: "Evidence Collection",
    shortName: "Evidence",
    category: "Response",
    status: "active",
    icon: "📸",
    capability: "Snapshot logs, processes, and memory for forensic review",
    scope: ["10 agents", "S3 evidence bucket"],
    metrics: [
      { label: "Collecting", value: "1", status: "warn" },
      { label: "Stored today", value: "2", status: "ok" },
      { label: "Retention", value: "90 days", status: "ok" },
    ],
    playbooks: ["Collect Evidence", "Memory Dump", "Export Logs"],
    lastReport: {
      id: "CR-05",
      time: "09:26",
      kind: "execution",
      title: "Evidence collection running",
      detail: "it-laptop-02 · approved by Somchai · 67% complete",
      severity: "low",
    },
  },
  {
    id: "webhooks",
    name: "Webhook Ingest",
    shortName: "Webhooks",
    category: "Integration",
    status: "active",
    icon: "🔗",
    capability: "Receive alerts from Wazuh, GitHub, and custom sources",
    scope: ["Wazuh", "GitHub", "Custom HTTP"],
    metrics: [
      { label: "Sources", value: "3", status: "ok" },
      { label: "Events/hr", value: "842", status: "ok" },
      { label: "Failed", value: "0", status: "ok" },
    ],
    playbooks: ["Wazuh Alert Handler", "GitHub Secret Scan"],
  },
  {
    id: "branching",
    name: "Conditional Branching",
    shortName: "Branching",
    category: "Orchestration",
    status: "active",
    icon: "🔀",
    capability: "Route playbooks by severity, asset criticality, and time of day",
    scope: ["8 conditions", "Exec asset rules"],
    metrics: [
      { label: "Rules", value: "8", status: "ok" },
      { label: "Exec path", value: "Stricter gate", status: "ok" },
      { label: "Branches today", value: "12", status: "ok" },
    ],
    playbooks: ["Severity Router", "Asset Tier Router"],
  },
  {
    id: "schedule",
    name: "Scheduled Workflows",
    shortName: "Schedule",
    category: "Orchestration",
    status: "active",
    icon: "⏰",
    capability: "Cron-based security hygiene and compliance checks",
    scope: ["Daily posture", "Weekly compliance"],
    metrics: [
      { label: "Scheduled", value: "4", status: "ok" },
      { label: "Next run", value: "06:00", status: "ok" },
      { label: "Missed", value: "0", status: "ok" },
    ],
    playbooks: ["Daily Posture Report", "Weekly Compliance Scan"],
    lastReport: {
      id: "CR-06",
      time: "06:00",
      kind: "status",
      title: "Daily posture sent",
      detail: "Score 84 · forwarded to Bangkaew inbox",
      severity: "low",
      acknowledged: true,
    },
  },
  {
    id: "subflows",
    name: "Sub-workflows",
    shortName: "Subflows",
    category: "Orchestration",
    status: "active",
    icon: "🧩",
    capability: "Reusable blocks shared across containment and notification playbooks",
    scope: ["6 reusable blocks", "Version controlled"],
    metrics: [
      { label: "Blocks", value: "6", status: "ok" },
      { label: "Reused", value: "18× today", status: "ok" },
      { label: "Versions", value: "v3.2", status: "ok" },
    ],
    playbooks: ["Notify Block", "Evidence Block", "Ticket Block"],
  },
  {
    id: "apps",
    name: "Security App Integrations",
    shortName: "Apps",
    category: "Integration",
    status: "active",
    icon: "🔌",
    capability: "Connected apps: Wazuh, FortiGate, Jira, LINE, SMTP, AWS",
    scope: ["6 connected", "2 health warn"],
    metrics: [
      { label: "Connected", value: "6/8", status: "warn" },
      { label: "API calls", value: "1.2k/day", status: "ok" },
      { label: "Errors", value: "0", status: "ok" },
    ],
    playbooks: ["Health Check All Apps"],
  },
  {
    id: "approval-gate",
    name: "Bangkaew Approval Gate",
    shortName: "Approval",
    category: "Governance",
    status: "active",
    icon: "✋",
    capability: "Every Collie action requires Bangkaew approval before execution — no auto-run",
    scope: ["100% gated", "Audit logged", "Human in loop"],
    metrics: [
      { label: "Pending", value: "2", status: "warn" },
      { label: "Approved today", value: "1", status: "ok" },
      { label: "Denied", value: "0", status: "ok" },
    ],
    playbooks: ["All playbooks"],
    lastReport: {
      id: "CR-07",
      time: "11:06",
      kind: "approval_request",
      title: "2 actions awaiting you",
      detail: "Block IP + Isolate host · open Bangkaew chat",
      severity: "high",
    },
  },
  {
    id: "audit",
    name: "Execution Audit Log",
    shortName: "Audit",
    category: "Governance",
    status: "active",
    icon: "📜",
    capability: "Full trail of who approved what, when, and playbook results",
    scope: ["Immutable log", "90-day retention"],
    metrics: [
      { label: "Entries today", value: "14", status: "ok" },
      { label: "Approvals", value: "3", status: "ok" },
      { label: "Failures", value: "0", status: "ok" },
    ],
    playbooks: ["Export Audit Trail"],
    lastReport: {
      id: "CR-08",
      time: "02:06",
      kind: "audit",
      title: "Block IP executed",
      detail: "Approved by Somchai · IP 185.220.101.42 · RUN-88",
      severity: "low",
      acknowledged: true,
    },
  },
  {
    id: "threat-intel",
    name: "Threat Intel Enrichment",
    shortName: "Intel",
    category: "Integration",
    status: "partial",
    icon: "🌐",
    capability: "Enrich IOCs via VirusTotal and abuse.ch before Bangkaew recommends action",
    scope: ["VirusTotal", "abuse.ch"],
    metrics: [
      { label: "Lookups today", value: "8", status: "ok" },
      { label: "Malicious", value: "2", status: "warn" },
      { label: "Cache hit", value: "74%", status: "ok" },
    ],
    playbooks: ["Enrich IP", "Enrich Hash", "Enrich Domain"],
  },
  {
    id: "cases",
    name: "Case Management",
    shortName: "Cases",
    category: "Governance",
    status: "active",
    icon: "📂",
    capability: "Link playbooks, evidence, and approvals to incident cases",
    scope: ["3 open cases", "Bangkaew owner"],
    metrics: [
      { label: "Open cases", value: "3", status: "warn" },
      { label: "Avg age", value: "1.2 days", status: "ok" },
      { label: "Linked runs", value: "7", status: "ok" },
    ],
    playbooks: ["Open Case", "Merge Cases", "Close Case"],
    lastReport: {
      id: "CR-09",
      time: "11:35",
      kind: "status",
      title: "Case sync to Bangkaew",
      detail: "INC-2026-039 updated · 2 pending actions attached",
      severity: "medium",
    },
  },
];

export const shuffleModulesDisabled: Pick<ShuffleModule, "id" | "name" | "shortName" | "category" | "icon">[] = [
  { id: "orgs", name: "Multi-tenant Organizations", shortName: "Orgs", category: "Governance", icon: "🏢" },
  { id: "python-apps", name: "Python Script Apps", shortName: "Python", category: "Integration", icon: "🐍" },
  { id: "openapi", name: "OpenAPI App Builder", shortName: "OpenAPI", category: "Integration", icon: "📡" },
  { id: "marketplace", name: "App Marketplace", shortName: "Market", category: "Integration", icon: "🛒" },
];

export interface CollieActionTemplate {
  id: string;
  label: string;
  moduleId: string;
  playbook: string;
  impact: "Low" | "Medium" | "High";
  target: string;
  incident?: string;
  detail: string;
  resultMessage: string;
  durationMs: number;
}

export const collieActionCatalog: CollieActionTemplate[] = [
  {
    id: "block-ip",
    label: "Block IP",
    moduleId: "firewall",
    playbook: "Block IP",
    impact: "High",
    target: "203.150.10.88",
    incident: "INC-2026-039",
    detail: "Add deny rule on FortiGate + AWS SG · 24h TTL",
    resultMessage: "IP blocked on perimeter and cloud SG",
    durationMs: 3000,
  },
  {
    id: "isolate-host",
    label: "Isolate Host",
    moduleId: "edr",
    playbook: "Isolate Host",
    impact: "High",
    target: "it-laptop-02",
    incident: "INC-2026-041",
    detail: "Network isolate via Wazuh active response · VLAN quarantine",
    resultMessage: "Host isolated · outbound traffic blocked",
    durationMs: 4000,
  },
  {
    id: "notify-admin",
    label: "Notify Admin",
    moduleId: "notify",
    playbook: "Notify Admin",
    impact: "Low",
    target: "SOC on-call",
    incident: "INC-2026-039",
    detail: "Email + LINE alert to on-call · include incident summary",
    resultMessage: "LINE + Email sent to on-call",
    durationMs: 2500,
  },
  {
    id: "collect-evidence",
    label: "Collect Evidence",
    moduleId: "evidence",
    playbook: "Collect Evidence",
    impact: "Low",
    target: "it-laptop-02",
    incident: "INC-2026-041",
    detail: "Process list, network connections, and auth logs snapshot",
    resultMessage: "Evidence package uploaded to S3",
    durationMs: 5000,
  },
  {
    id: "open-ticket",
    label: "Open Jira Ticket",
    moduleId: "tickets",
    playbook: "Open Ticket",
    impact: "Medium",
    target: "Jira SOC-142",
    incident: "INC-2026-041",
    detail: "Create SOC ticket with severity High and link incident",
    resultMessage: "Jira SOC-142 created and assigned",
    durationMs: 2800,
  },
  {
    id: "enrich-ioc",
    label: "Enrich IOC",
    moduleId: "threat-intel",
    playbook: "Enrich IP",
    impact: "Low",
    target: "185.220.101.42",
    incident: "INC-2026-042",
    detail: "VirusTotal + abuse.ch lookup · attach score to case",
    resultMessage: "IOC scored malicious · 12/90 detections",
    durationMs: 3500,
  },
];

export const collieBangkaewReports: CollieBangkaewReport[] = [
  {
    id: "CR-03",
    time: "11:06",
    kind: "approval_request",
    title: "Block 203.150.10.88",
    detail: "Firewall playbook · INC-2026-039 · awaiting Bangkaew",
    severity: "medium",
  },
  {
    id: "CR-04",
    time: "09:25",
    kind: "approval_request",
    title: "Isolate it-laptop-02",
    detail: "EDR playbook · INC-2026-041 · awaiting Bangkaew",
    severity: "high",
  },
  {
    id: "CR-05",
    time: "09:26",
    kind: "execution",
    title: "Evidence collection in progress",
    detail: "Approved earlier · it-laptop-02 · 67%",
    severity: "low",
  },
  {
    id: "CR-08",
    time: "02:06",
    kind: "audit",
    title: "Block IP executed",
    detail: "Approved by Somchai · 185.220.101.42 · RUN-88",
    severity: "low",
    acknowledged: true,
  },
  {
    id: "CR-06",
    time: "06:00",
    kind: "status",
    title: "Daily posture workflow",
    detail: "Scheduled run completed · sent to Bangkaew",
    severity: "low",
    acknowledged: true,
  },
];

export const shuffleCategories = [
  "Overview",
  "Response",
  "Communication",
  "Orchestration",
  "Integration",
  "Governance",
] as const;

export type ShuffleTab = (typeof shuffleCategories)[number] | string;

export function getShuffleModulesByCategory(category: Exclude<ShuffleTab, "Overview">): ShuffleModule[] {
  return shuffleModules.filter((m) => m.category === category);
}

export const collieMonitorSummary = {
  playbooksArmed: 5,
  pendingApproval: 2,
  runsToday: 3,
  modulesActive: 16,
  modulesTotal: 20,
  approvalGate: "100%",
  connectedApps: 6,
};

export const collieReportKindLabel: Record<CollieReportKind, string> = {
  approval_request: "Approval request",
  status: "Status",
  execution: "Executing",
  audit: "Audit",
};

export const collieReportKindStyle: Record<CollieReportKind, string> = {
  approval_request: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  status: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  execution: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  audit: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
};
