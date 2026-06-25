export type Severity = "low" | "medium" | "high" | "critical";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type IncidentStatus =
  | "Open"
  | "Investigating"
  | "Waiting Approval"
  | "Containment Running"
  | "Contained"
  | "Fixing Code"
  | "Verifying"
  | "Resolved"
  | "Closed";

export type EndpointStatus = "Online" | "Offline" | "Warning";

export interface DemoNavItem {
  label: string;
  href: string;
}

export interface DemoNavGroup {
  title: string;
  icon: string;
  items: DemoNavItem[];
}

export interface StatMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface Endpoint {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  agentId: string;
  status: EndpointStatus;
  lastSeen: string;
  riskLevel: RiskLevel;
  version: string;
  group: string;
  owner: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  endpoint: string;
  sourceIp: string;
  createdAt: string;
  assignedAgent: string;
  pendingAction: string;
}

export interface Alert {
  id: string;
  time: string;
  severity: Severity;
  source: string;
  ruleId: string;
  endpoint: string;
  sourceIp: string;
  message: string;
  incidentId?: string;
}

export interface Repository {
  id: string;
  name: string;
  stack: string;
  lastScan: string;
  riskLevel: RiskLevel;
  openFindings: number;
  openPrs: number;
  cicdGate: "Enabled" | "Disabled";
  branchProtection: "Enabled" | "Disabled";
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  file: string;
  line: number;
  tool: string;
  cwe: string;
  status: "Open" | "Fixed" | "False Positive" | "In Progress";
  autoFix: boolean;
  owner: string;
}

export interface PullRequest {
  id: string;
  title: string;
  repo: string;
  branch: string;
  finding: string;
  status: "Open" | "Merged" | "Failed" | "Verified";
  ciStatus: "Passing" | "Failing" | "Pending";
  reviewer: string;
}

export interface Approval {
  id: string;
  action: string;
  incident: string;
  impact: RiskLevel;
  target: string;
  reason: string;
  requestedBy: string;
  time: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  impact: RiskLevel;
  approvalRequired: boolean;
  mappedIncidents: string[];
}

export interface PlaybookRun {
  id: string;
  playbook: string;
  incident: string;
  status: "Success" | "Failed" | "Running" | "Pending";
  startedAt: string;
  finishedAt: string;
  result: string;
}

export interface Integration {
  name: string;
  status: "Connected" | "Not Configured" | "Error" | "Updated";
  lastSync: string;
  detail?: string;
}

export interface AgentWorker {
  name: string;
  role: string;
  status: "Idle" | "Working" | "Waiting Approval";
  currentTask: string;
  lastOutput: string;
  confidence: number;
}

export interface TimelineEvent {
  time: string;
  event: string;
  actor?: string;
}
