import type {
  AgentWorker,
  Alert,
  Approval,
  Endpoint,
  Finding,
  Incident,
  Integration,
  Playbook,
  PlaybookRun,
  PullRequest,
  Repository,
  TimelineEvent,
} from "./types";

export const executiveDashboard = {
  securityScore: 84,
  riskLevel: "Medium" as const,
  activeIncidents: 0,
  openVulnerabilities: 12,
  protectedEndpoints: 10,
  githubRepos: 4,
  lastScan: "2026-06-25 08:30",
  lastIncident: "INC-2024-089 — Brute Force (Resolved)",
  mttd: "12s",
  mttr: "3m 24s",
  autoPrOpened: 3,
  pendingApproval: 2,
  protection: [
    { label: "GitHub connected", ok: true },
    { label: "CI/CD gate enabled", ok: true },
    { label: "Runtime monitoring enabled", ok: true },
    { label: "Wazuh connected", ok: true },
    { label: "Shuffle connected", ok: true },
    { label: "Legal report enabled", ok: true },
  ],
  scoreTrend: [72, 75, 78, 80, 82, 84],
};

export const endpoints: Endpoint[] = [
  { id: "ep-1", hostname: "srv-prod-01", ip: "10.0.1.10", os: "Ubuntu 22.04", agentId: "001", status: "Online", lastSeen: "2 min ago", riskLevel: "Low", version: "4.7.2", group: "servers", owner: "DevOps" },
  { id: "ep-2", hostname: "srv-prod-02", ip: "10.0.1.11", os: "Ubuntu 22.04", agentId: "002", status: "Online", lastSeen: "1 min ago", riskLevel: "Medium", version: "4.7.2", group: "servers", owner: "DevOps" },
  { id: "ep-3", hostname: "it-laptop-01", ip: "10.0.2.15", os: "Windows 11", agentId: "003", status: "Online", lastSeen: "5 min ago", riskLevel: "Low", version: "4.7.2", group: "it", owner: "Somchai" },
  { id: "ep-4", hostname: "it-laptop-02", ip: "10.0.2.16", os: "macOS 14", agentId: "004", status: "Warning", lastSeen: "45 min ago", riskLevel: "High", version: "4.7.1", group: "it", owner: "Nattaya" },
  { id: "ep-5", hostname: "exec-pc-01", ip: "10.0.3.20", os: "Windows 11", agentId: "005", status: "Online", lastSeen: "3 min ago", riskLevel: "Medium", version: "4.7.2", group: "executive", owner: "CEO Office" },
  { id: "ep-6", hostname: "dev-staging", ip: "10.0.4.5", os: "Debian 12", agentId: "006", status: "Offline", lastSeen: "2 days ago", riskLevel: "Critical", version: "4.6.0", group: "dev", owner: "R&D" },
];

export const incidents: Incident[] = [
  { id: "INC-2026-042", title: "Brute Force on Executive PC", severity: "critical", status: "Resolved", endpoint: "exec-pc-01", sourceIp: "185.220.101.42", createdAt: "2026-06-24 02:14", assignedAgent: "Bangkaew", pendingAction: "None" },
  { id: "INC-2026-041", title: "Suspicious PowerShell Execution", severity: "high", status: "Waiting Approval", endpoint: "it-laptop-02", sourceIp: "—", createdAt: "2026-06-25 09:22", assignedAgent: "Shepherd", pendingAction: "Isolate host" },
  { id: "INC-2026-040", title: "CVE-2024-1234 in container", severity: "high", status: "Fixing Code", endpoint: "srv-prod-01", sourceIp: "—", createdAt: "2026-06-23 14:00", assignedAgent: "Retriever", pendingAction: "PR review" },
  { id: "INC-2026-039", title: "Failed login spike", severity: "medium", status: "Investigating", endpoint: "srv-prod-02", sourceIp: "203.150.10.88", createdAt: "2026-06-25 11:05", assignedAgent: "Bangkaew", pendingAction: "Block IP" },
];

export const alerts: Alert[] = [
  { id: "ALT-901", time: "11:32:01", severity: "high", source: "Wazuh", ruleId: "5710", endpoint: "it-laptop-02", sourceIp: "—", message: "Suspicious PowerShell encoded command", incidentId: "INC-2026-041" },
  { id: "ALT-900", time: "11:05:44", severity: "medium", source: "Wazuh", ruleId: "5503", endpoint: "srv-prod-02", sourceIp: "203.150.10.88", message: "Multiple authentication failures", incidentId: "INC-2026-039" },
  { id: "ALT-899", time: "10:48:12", severity: "low", source: "App Log", ruleId: "APP-012", endpoint: "srv-prod-01", sourceIp: "10.0.2.15", message: "Rate limit threshold 80% reached" },
  { id: "ALT-898", time: "09:15:00", severity: "critical", source: "Wazuh", ruleId: "31151", endpoint: "exec-pc-01", sourceIp: "185.220.101.42", message: "Brute force attack detected", incidentId: "INC-2026-042" },
];

export const repositories: Repository[] = [
  { id: "repo-1", name: "acme/web-app", stack: "Node.js", lastScan: "2026-06-25 08:00", riskLevel: "Medium", openFindings: 5, openPrs: 1, cicdGate: "Enabled", branchProtection: "Enabled" },
  { id: "repo-2", name: "acme/api-service", stack: "Python", lastScan: "2026-06-25 07:30", riskLevel: "High", openFindings: 8, openPrs: 2, cicdGate: "Enabled", branchProtection: "Enabled" },
  { id: "repo-3", name: "acme/infra", stack: "Terraform", lastScan: "2026-06-24 18:00", riskLevel: "Low", openFindings: 2, openPrs: 0, cicdGate: "Enabled", branchProtection: "Disabled" },
  { id: "repo-4", name: "acme/mobile-app", stack: "React Native", lastScan: "2026-06-23 12:00", riskLevel: "Medium", openFindings: 3, openPrs: 0, cicdGate: "Disabled", branchProtection: "Enabled" },
];

export const findings: Finding[] = [
  { id: "F-101", title: "SQL Injection risk in login handler", severity: "critical", file: "src/auth/login.ts", line: 42, tool: "Semgrep", cwe: "CWE-89", status: "Open", autoFix: true, owner: "dev-team" },
  { id: "F-102", title: "Hardcoded API key detected", severity: "high", file: "config/prod.env.example", line: 8, tool: "Gitleaks", cwe: "CWE-798", status: "In Progress", autoFix: true, owner: "security" },
  { id: "F-103", title: "Outdated dependency: lodash@4.17.15", severity: "high", file: "package-lock.json", line: 0, tool: "Trivy", cwe: "CVE-2020-8203", status: "Open", autoFix: true, owner: "dev-team" },
  { id: "F-104", title: "Missing rate limit on /api/login", severity: "medium", file: "src/routes/auth.ts", line: 15, tool: "Semgrep", cwe: "CWE-770", status: "Open", autoFix: true, owner: "dev-team" },
  { id: "F-105", title: "Dockerfile runs as root", severity: "medium", file: "Dockerfile", line: 12, tool: "Trivy", cwe: "CIS-4.1", status: "Fixed", autoFix: true, owner: "devops" },
];

export const pullRequests: PullRequest[] = [
  { id: "PR-45", title: "Add login abuse protection", repo: "acme/web-app", branch: "fix/login-rate-limit", finding: "F-104", status: "Open", ciStatus: "Passing", reviewer: "Somchai" },
  { id: "PR-44", title: "Bump lodash to 4.17.21", repo: "acme/api-service", branch: "fix/cve-lodash", finding: "F-103", status: "Open", ciStatus: "Pending", reviewer: "—" },
  { id: "PR-43", title: "Remove exposed API key pattern", repo: "acme/api-service", branch: "fix/gitleaks-102", finding: "F-102", status: "Merged", ciStatus: "Passing", reviewer: "Security Team" },
];

export const approvals: Approval[] = [
  { id: "APR-12", action: "Block IP", incident: "INC-2026-039", impact: "Medium", target: "203.150.10.88", reason: "Repeated failed login attempts from foreign IP", requestedBy: "Agent Bangkaew", time: "11:06" },
  { id: "APR-11", action: "Isolate host", incident: "INC-2026-041", impact: "High", target: "it-laptop-02", reason: "Suspicious PowerShell execution detected", requestedBy: "Agent Shepherd", time: "09:25" },
];

export const integrations: Integration[] = [
  { name: "Wazuh", status: "Connected", lastSync: "1 min ago" },
  { name: "Shuffle", status: "Connected", lastSync: "2 min ago" },
  { name: "GitHub", status: "Connected", lastSync: "5 min ago", detail: "4 repos" },
  { name: "LLM (DeepSeek)", status: "Connected", lastSync: "—" },
  { name: "Email (SMTP)", status: "Connected", lastSync: "—" },
  { name: "LINE Notify", status: "Connected", lastSync: "—" },
  { name: "Caldera", status: "Not Configured", lastSync: "—" },
  { name: "Scanner DB", status: "Updated", lastSync: "2026-06-25 06:00" },
];

export const playbooks: Playbook[] = [
  { id: "pb-1", name: "Notify Admin", description: "Send alert to admin via email/LINE", impact: "Low", approvalRequired: false, mappedIncidents: ["All"] },
  { id: "pb-2", name: "Block IP", description: "Add firewall rule to block source IP", impact: "High", approvalRequired: true, mappedIncidents: ["Brute Force", "Scanning"] },
  { id: "pb-3", name: "Isolate Host", description: "Network isolate affected endpoint", impact: "High", approvalRequired: true, mappedIncidents: ["Malware", "Suspicious Process"] },
  { id: "pb-4", name: "Collect Evidence", description: "Snapshot logs and process list", impact: "Low", approvalRequired: false, mappedIncidents: ["All"] },
  { id: "pb-5", name: "Open Hotfix PR", description: "Trigger Retriever to open fix PR", impact: "Medium", approvalRequired: true, mappedIncidents: ["CVE", "Code Vuln"] },
];

export const playbookRuns: PlaybookRun[] = [
  { id: "RUN-88", playbook: "Block IP", incident: "INC-2026-042", status: "Success", startedAt: "02:06", finishedAt: "02:06", result: "IP 185.220.101.42 blocked for 24h" },
  { id: "RUN-87", playbook: "Notify Admin", incident: "INC-2026-042", status: "Success", startedAt: "02:05", finishedAt: "02:05", result: "LINE + Email sent" },
  { id: "RUN-86", playbook: "Collect Evidence", incident: "INC-2026-041", status: "Running", startedAt: "09:26", finishedAt: "—", result: "Collecting process dump..." },
];

export const agentWorkers: AgentWorker[] = [
  { name: "Commander", role: "Pack Leader", status: "Idle", currentTask: "—", lastOutput: "System posture: Medium risk", confidence: 0.92 },
  { name: "Triage", role: "Alert Analysis", status: "Working", currentTask: "INC-2026-039", lastOutput: "Correlating 3 related alerts", confidence: 0.88 },
  { name: "Containment", role: "Response", status: "Waiting Approval", currentTask: "Isolate it-laptop-02", lastOutput: "Awaiting human approval", confidence: 0.95 },
  { name: "Retriever", role: "Code Fix", status: "Working", currentTask: "PR-44 review", lastOutput: "Patch generated for CVE-2020-8203", confidence: 0.85 },
  { name: "Pitbull", role: "Red Team", status: "Idle", currentTask: "—", lastOutput: "Last sim: Brute force — Detected 12s", confidence: 0.90 },
];

export const incidentTimeline: TimelineEvent[] = [
  { time: "02:01", event: "Wazuh alert received", actor: "Shepherd" },
  { time: "02:02", event: "Incident created", actor: "System" },
  { time: "02:03", event: "AI triage completed — Critical", actor: "Bangkaew" },
  { time: "02:04", event: "Block IP recommended", actor: "Bangkaew" },
  { time: "02:05", event: "Admin approved block IP", actor: "Somchai" },
  { time: "02:06", event: "Shuffle playbook executed", actor: "Collie" },
  { time: "02:08", event: "Evidence snapshot completed", actor: "Collie" },
  { time: "02:10", event: "GitHub PR opened", actor: "Retriever" },
  { time: "02:15", event: "Report generated", actor: "Bangkaew" },
];

export const setupSteps = [
  { step: 1, title: "Create Admin Account", done: true },
  { step: 2, title: "Organization Profile", done: true },
  { step: 3, title: "Connect Wazuh", done: true },
  { step: 4, title: "Connect Shuffle", done: true },
  { step: 5, title: "Connect GitHub", done: true },
  { step: 6, title: "Connect LLM Provider", done: true },
  { step: 7, title: "Connect Notification", done: true },
  { step: 8, title: "Define Approval Policy", done: true },
  { step: 9, title: "Deploy Endpoint Agent", done: true },
  { step: 10, title: "Run First Baseline Scan", done: false },
];

export const checklistItems = [
  { label: "Connect GitHub", done: true },
  { label: "Install Wazuh Agent", done: true },
  { label: "Enable Runtime Monitoring", done: true },
  { label: "Enable CI/CD Gate", done: true },
  { label: "Configure Notification", done: true },
  { label: "Run First Scan", done: false },
  { label: "Approve First Hardening PR", done: false },
];

export const mitreTactics = [
  { tactic: "Initial Access", covered: 3, total: 5 },
  { tactic: "Execution", covered: 4, total: 6 },
  { tactic: "Persistence", covered: 2, total: 4 },
  { tactic: "Privilege Escalation", covered: 3, total: 5 },
  { tactic: "Defense Evasion", covered: 2, total: 5 },
  { tactic: "Credential Access", covered: 4, total: 5 },
  { tactic: "Discovery", covered: 3, total: 4 },
  { tactic: "Lateral Movement", covered: 2, total: 4 },
  { tactic: "Collection", covered: 1, total: 3 },
  { tactic: "Exfiltration", covered: 2, total: 3 },
  { tactic: "Impact", covered: 3, total: 4 },
];

export const chatMessages = [
  { role: "user" as const, text: "Is the system secure right now?" },
  { role: "assistant" as const, text: "Overall security score is 84/100 (Medium risk). 10 endpoints protected, 0 active incidents. 2 actions pending your approval. 3 high-risk code findings remain open." },
  { role: "user" as const, text: "Which machine is most at risk?" },
  { role: "assistant" as const, text: "dev-staging (Offline, Critical) — agent hasn't checked in for 2 days. it-laptop-02 has an open incident (INC-2026-041) with suspicious PowerShell." },
];
