export type WazuhModuleStatus = "active" | "partial" | "disabled";

export interface WazuhMonitorMetric {
  label: string;
  value: string;
  status?: "ok" | "warn" | "critical";
}

export interface WazuhBangkaewReport {
  id: string;
  time: string;
  kind: "alert" | "summary" | "command" | "posture";
  title: string;
  detail: string;
  severity?: "low" | "medium" | "high" | "critical";
  acknowledged?: boolean;
}

export interface WazuhModule {
  id: string;
  name: string;
  shortName: string;
  category: "Detection" | "Assessment" | "Response" | "Infrastructure" | "Platform";
  status: WazuhModuleStatus;
  icon: string;
  monitoring: string;
  scope: string[];
  metrics: WazuhMonitorMetric[];
  lastReport?: WazuhBangkaewReport;
}

/** 16 of 20 core Wazuh modules enabled (~80% coverage) */
export const wazuhModules: WazuhModule[] = [
  {
    id: "siem",
    name: "SIEM & Log Analysis",
    shortName: "SIEM",
    category: "Detection",
    status: "active",
    icon: "📊",
    monitoring: "Auth, system, application, and firewall logs across all agents",
    scope: ["10 agents", "4 log sources", "12.4k events/hr"],
    metrics: [
      { label: "Events today", value: "284,120", status: "ok" },
      { label: "Rules firing", value: "47", status: "warn" },
      { label: "Decoders", value: "1,024 active", status: "ok" },
    ],
    lastReport: {
      id: "SR-01",
      time: "11:05",
      kind: "alert",
      title: "Auth failure spike",
      detail: "srv-prod-02 · rule 5503 · 47 failures from 203.150.10.88",
      severity: "medium",
    },
  },
  {
    id: "hids",
    name: "Host Intrusion Detection",
    shortName: "HIDS",
    category: "Detection",
    status: "active",
    icon: "🛡️",
    monitoring: "Process, registry, and network anomalies on endpoints",
    scope: ["10 agents", "842 processes tracked"],
    metrics: [
      { label: "Process events", value: "18,402", status: "ok" },
      { label: "Suspicious", value: "3", status: "warn" },
      { label: "Blocked attempts", value: "0", status: "ok" },
    ],
    lastReport: {
      id: "SR-02",
      time: "11:32",
      kind: "alert",
      title: "Suspicious PowerShell",
      detail: "it-laptop-02 · rule 5710 · encoded command execution",
      severity: "high",
    },
  },
  {
    id: "rootcheck",
    name: "Rootcheck",
    shortName: "Rootcheck",
    category: "Detection",
    status: "active",
    icon: "🔍",
    monitoring: "Rootkit, trojan, and policy violation scans",
    scope: ["10 agents", "Daily scan"],
    metrics: [
      { label: "Last scan", value: "06:00 today", status: "ok" },
      { label: "Findings", value: "0 critical", status: "ok" },
      { label: "Policy checks", value: "128 passed", status: "ok" },
    ],
    lastReport: {
      id: "SR-03",
      time: "06:05",
      kind: "posture",
      title: "Daily rootcheck clean",
      detail: "All 10 agents · 0 rootkit indicators",
      severity: "low",
      acknowledged: true,
    },
  },
  {
    id: "malware",
    name: "Malware Detection",
    shortName: "Malware",
    category: "Detection",
    status: "active",
    icon: "🦠",
    monitoring: "YARA rules, hash matching, and suspicious file activity",
    scope: ["10 agents", "240 YARA rules"],
    metrics: [
      { label: "Files scanned", value: "4,821", status: "ok" },
      { label: "Matches", value: "0", status: "ok" },
      { label: "Quarantined", value: "0", status: "ok" },
    ],
  },
  {
    id: "threat-intel",
    name: "Threat Intelligence",
    shortName: "Threat Intel",
    category: "Detection",
    status: "active",
    icon: "🌐",
    monitoring: "Known-bad IPs, domains, and file hashes from feeds",
    scope: ["4 feeds synced", "12.8k IOCs"],
    metrics: [
      { label: "Feed updates", value: "2h ago", status: "ok" },
      { label: "IP matches", value: "2 today", status: "warn" },
      { label: "Hash matches", value: "0", status: "ok" },
    ],
    lastReport: {
      id: "SR-04",
      time: "09:15",
      kind: "alert",
      title: "Known-bad IP login attempt",
      detail: "exec-pc-01 · 185.220.101.42 on threat feed",
      severity: "critical",
    },
  },
  {
    id: "vuln",
    name: "Vulnerability Detection",
    shortName: "Vulnerabilities",
    category: "Assessment",
    status: "active",
    icon: "🔓",
    monitoring: "OS packages, libraries, and CVE mapping",
    scope: ["10 agents", "NVD + vendor feeds"],
    metrics: [
      { label: "Open CVEs", value: "12", status: "warn" },
      { label: "Critical", value: "2", status: "critical" },
      { label: "Last scan", value: "08:00", status: "ok" },
    ],
    lastReport: {
      id: "SR-05",
      time: "08:05",
      kind: "summary",
      title: "CVE summary forwarded",
      detail: "2 critical on srv-prod-01 · forwarded for Retriever patch",
      severity: "high",
    },
  },
  {
    id: "sca",
    name: "Security Configuration Assessment",
    shortName: "SCA",
    category: "Assessment",
    status: "active",
    icon: "📋",
    monitoring: "CIS benchmarks and hardening policy compliance",
    scope: ["10 agents", "CIS Ubuntu + Windows"],
    metrics: [
      { label: "Compliance avg", value: "91%", status: "ok" },
      { label: "Failed checks", value: "14", status: "warn" },
      { label: "Policies", value: "2 active", status: "ok" },
    ],
    lastReport: {
      id: "SR-06",
      time: "07:00",
      kind: "posture",
      title: "SCA drift on dev-staging",
      detail: "Agent offline 2 days · compliance score dropped to 62%",
      severity: "medium",
    },
  },
  {
    id: "fim",
    name: "File Integrity Monitoring",
    shortName: "FIM",
    category: "Assessment",
    status: "active",
    icon: "📁",
    monitoring: "Critical system and config file changes",
    scope: ["10 agents", "842 paths watched"],
    metrics: [
      { label: "Changes today", value: "23", status: "ok" },
      { label: "Unauthorized", value: "1", status: "warn" },
      { label: "Baseline", value: "Synced", status: "ok" },
    ],
    lastReport: {
      id: "SR-07",
      time: "10:12",
      kind: "alert",
      title: "Unauthorized /etc/passwd change",
      detail: "srv-prod-01 · whitelisted after review",
      severity: "low",
      acknowledged: true,
    },
  },
  {
    id: "compliance",
    name: "Regulatory Compliance",
    shortName: "Compliance",
    category: "Assessment",
    status: "partial",
    icon: "⚖️",
    monitoring: "PCI-DSS and GDPR control mapping from Wazuh checks",
    scope: ["PCI-DSS v4", "GDPR basics"],
    metrics: [
      { label: "PCI controls", value: "94% pass", status: "ok" },
      { label: "GDPR gaps", value: "3 open", status: "warn" },
      { label: "Last audit", value: "Jun 20", status: "ok" },
    ],
    lastReport: {
      id: "SR-08",
      time: "07:30",
      kind: "summary",
      title: "Weekly compliance digest",
      detail: "PCI 94% · 3 GDPR items need policy update",
      severity: "low",
    },
  },
  {
    id: "active-response",
    name: "Active Response",
    shortName: "Active Response",
    category: "Response",
    status: "active",
    icon: "⚡",
    monitoring: "Automated countermeasures — requires Bangkaew approval for high impact",
    scope: ["4 playbooks linked", "Human approval gate"],
    metrics: [
      { label: "Armed responses", value: "4", status: "ok" },
      { label: "Pending approval", value: "2", status: "warn" },
      { label: "Executed today", value: "1", status: "ok" },
    ],
    lastReport: {
      id: "SR-09",
      time: "09:25",
      kind: "command",
      title: "Request isolate host",
      detail: "it-laptop-02 · INC-2026-041 · awaiting Bangkaew approval",
      severity: "high",
    },
  },
  {
    id: "mitre",
    name: "MITRE ATT&CK Mapping",
    shortName: "MITRE",
    category: "Response",
    status: "active",
    icon: "🎯",
    monitoring: "Alert-to-tactic mapping for incident correlation",
    scope: ["14 tactics covered", "186 techniques mapped"],
    metrics: [
      { label: "Alerts mapped", value: "4 today", status: "ok" },
      { label: "Top tactic", value: "Credential Access", status: "warn" },
      { label: "Coverage", value: "78%", status: "ok" },
    ],
    lastReport: {
      id: "SR-10",
      time: "11:06",
      kind: "summary",
      title: "Tactic map for INC-2026-039",
      detail: "Credential Access + Brute Force · attached to Bangkaew incident",
      severity: "medium",
    },
  },
  {
    id: "agents",
    name: "Agent Management",
    shortName: "Agents",
    category: "Infrastructure",
    status: "active",
    icon: "🖥️",
    monitoring: "Endpoint enrollment, health, groups, and agent versions",
    scope: ["10 enrolled", "1 offline", "4 groups"],
    metrics: [
      { label: "Online", value: "9/10", status: "warn" },
      { label: "Outdated agents", value: "1", status: "warn" },
      { label: "Avg sync", value: "42s", status: "ok" },
    ],
    lastReport: {
      id: "SR-11",
      time: "08:00",
      kind: "posture",
      title: "Agent health report",
      detail: "dev-staging offline 2d · it-laptop-02 on v4.7.1",
      severity: "medium",
    },
  },
  {
    id: "cloud",
    name: "Cloud Security",
    shortName: "Cloud",
    category: "Infrastructure",
    status: "partial",
    icon: "☁️",
    monitoring: "AWS CloudTrail and IAM policy monitoring",
    scope: ["AWS prod account", "CloudTrail enabled"],
    metrics: [
      { label: "Accounts", value: "1 connected", status: "ok" },
      { label: "Events today", value: "1,204", status: "ok" },
      { label: "Misconfigs", value: "2", status: "warn" },
    ],
  },
  {
    id: "containers",
    name: "Container Security",
    shortName: "Containers",
    category: "Infrastructure",
    status: "active",
    icon: "📦",
    monitoring: "Docker daemon events and image vulnerability alerts",
    scope: ["srv-prod-01", "srv-prod-02", "8 containers"],
    metrics: [
      { label: "Containers", value: "8 running", status: "ok" },
      { label: "Image CVEs", value: "3", status: "warn" },
      { label: "Runtime alerts", value: "0", status: "ok" },
    ],
    lastReport: {
      id: "SR-12",
      time: "14:00",
      kind: "alert",
      title: "Container CVE detected",
      detail: "srv-prod-01 · CVE-2024-1234 · linked INC-2026-040",
      severity: "high",
    },
  },
  {
    id: "integrations",
    name: "GitHub & SaaS Monitoring",
    shortName: "SaaS",
    category: "Infrastructure",
    status: "active",
    icon: "🔗",
    monitoring: "GitHub audit logs and Office 365 sign-in anomalies",
    scope: ["GitHub org acme", "O365 tenant"],
    metrics: [
      { label: "GitHub events", value: "342/wk", status: "ok" },
      { label: "O365 alerts", value: "1", status: "warn" },
      { label: "Last sync", value: "5 min", status: "ok" },
    ],
  },
  {
    id: "dashboard",
    name: "Wazuh Dashboard",
    shortName: "Dashboard",
    category: "Platform",
    status: "active",
    icon: "📈",
    monitoring: "Visualizations, custom views, and alert dashboards",
    scope: ["6 custom dashboards", "SOC view active"],
    metrics: [
      { label: "Dashboards", value: "6", status: "ok" },
      { label: "Widgets", value: "24", status: "ok" },
      { label: "Users", value: "3 SOC analysts", status: "ok" },
    ],
    lastReport: {
      id: "SR-13",
      time: "11:35",
      kind: "summary",
      title: "SOC dashboard snapshot",
      detail: "Score 84 · 3 incidents · sent to Bangkaew inbox",
      severity: "low",
    },
  },
];

/** 4 modules not yet enabled — shown as disabled for full 20-feature map */
export const wazuhModulesDisabled: Pick<WazuhModule, "id" | "name" | "shortName" | "category" | "icon">[] = [
  { id: "indexer", name: "Indexer & Search", shortName: "Indexer", category: "Platform", icon: "🗄️" },
  { id: "api", name: "Wazuh API", shortName: "API", category: "Platform", icon: "🔌" },
  { id: "cis-cat", name: "CIS-CAT Integration", shortName: "CIS-CAT", category: "Assessment", icon: "✅" },
  { id: "decoders", name: "Custom Decoders & Rules", shortName: "Rules", category: "Platform", icon: "📝" },
];

export const shepherdBangkaewReports: WazuhBangkaewReport[] = [
  {
    id: "SR-02",
    time: "11:32",
    kind: "alert",
    title: "Suspicious PowerShell",
    detail: "it-laptop-02 · rule 5710 · forwarded as INC-2026-041",
    severity: "high",
  },
  {
    id: "SR-01",
    time: "11:05",
    kind: "alert",
    title: "Auth failure spike",
    detail: "srv-prod-02 · rule 5503 · forwarded as INC-2026-039",
    severity: "medium",
  },
  {
    id: "SR-09",
    time: "09:25",
    kind: "command",
    title: "Request isolate host",
    detail: "it-laptop-02 · active response · pending Bangkaew approval",
    severity: "high",
  },
  {
    id: "SR-04",
    time: "09:15",
    kind: "alert",
    title: "Brute force on executive PC",
    detail: "exec-pc-01 · rule 31151 · resolved INC-2026-042",
    severity: "critical",
    acknowledged: true,
  },
  {
    id: "SR-05",
    time: "08:05",
    kind: "summary",
    title: "CVE scan summary",
    detail: "12 open CVEs · 2 critical · Retriever notified",
    severity: "high",
  },
  {
    id: "SR-11",
    time: "08:00",
    kind: "posture",
    title: "Agent health report",
    detail: "9/10 online · dev-staging offline",
    severity: "medium",
  },
  {
    id: "SR-06",
    time: "07:00",
    kind: "posture",
    title: "SCA compliance drift",
    detail: "dev-staging score 62% · needs attention",
    severity: "medium",
  },
  {
    id: "SR-08",
    time: "07:30",
    kind: "summary",
    title: "Weekly compliance digest",
    detail: "PCI 94% · 3 GDPR gaps",
    severity: "low",
    acknowledged: true,
  },
];

export const wazuhCategories = [
  "Overview",
  "Detection",
  "Assessment",
  "Response",
  "Infrastructure",
  "Platform",
] as const;

export type WazuhTab = (typeof wazuhCategories)[number] | string;

export function getModulesByCategory(category: Exclude<WazuhTab, "Overview">): WazuhModule[] {
  return wazuhModules.filter((m) => m.category === category);
}

export const shepherdMonitorSummary = {
  agentsOnline: "9/10",
  rulesActive: "4,821",
  alertsToday: 4,
  reportsSent: 8,
  eventsPerHour: "12.4k",
  modulesActive: 16,
  modulesTotal: 20,
};

export const reportKindLabel: Record<WazuhBangkaewReport["kind"], string> = {
  alert: "Alert report",
  summary: "Summary",
  command: "Command",
  posture: "Posture",
};

export const reportKindStyle: Record<WazuhBangkaewReport["kind"], string> = {
  alert: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  summary: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  command: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  posture: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
};
