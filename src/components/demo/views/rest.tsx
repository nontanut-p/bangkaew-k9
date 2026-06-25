"use client";

import {
  DemoBanner,
  DemoButton,
  DemoPageHeader,
  DemoTable,
  SeverityBadge,
  StatusBadge,
} from "@/components/demo/ui";
import { findings, pullRequests, repositories, integrations } from "@/lib/demo/mock-data";
import { IntegrationHealthView } from "./setup";

export function RepositoriesView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Repositories" description="GitHub repos connected for code security" actions={<DemoButton>Connect Repo</DemoButton>} />
      <DemoTable
        columns={["Repo", "Stack", "Last Scan", "Risk", "Findings", "Open PRs", "CI Gate", "Branch Protect"]}
        rows={repositories.map((r) => [
          r.name, r.stack, r.lastScan, <SeverityBadge key={r.id} severity={r.riskLevel} />,
          r.openFindings, r.openPrs, <StatusBadge key={r.id} status={r.cicdGate} />, <StatusBadge key={r.id + "b"} status={r.branchProtection} />,
        ])}
      />
    </>
  );
}

export function BaselineScanView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Baseline Scan" description="First scan during onboarding" actions={<DemoButton>Run Scan</DemoButton>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-red-400">1</p><p className="text-xs text-slate-500">Critical</p></div>
        <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-orange-400">4</p><p className="text-xs text-slate-500">High</p></div>
        <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-amber-400">6</p><p className="text-xs text-slate-500">Medium</p></div>
        <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-cyan-400">3</p><p className="text-xs text-slate-500">Low</p></div>
      </div>
      <div className="glass-card p-4">
        <h3 className="font-semibold text-white">Scan Coverage</h3>
        <p className="mt-2 text-sm text-slate-400">SAST · Dependencies · Secrets · Dockerfile · IaC · GitHub Actions · Security headers</p>
        <p className="mt-2 text-sm text-emerald-400">Risk Score: 68/100 · 8 auto-fixes available</p>
      </div>
    </>
  );
}

export function FindingsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Findings" description="All code vulnerabilities from scans" actions={<DemoButton href="/demo/code/prs">View PRs</DemoButton>} />
      <DemoTable
        columns={["Finding", "Severity", "File", "Tool", "OWASP", "CWE", "Status", "Auto Fix", "Owner"]}
        rows={findings.map((f) => [
          f.title, <SeverityBadge key={f.id} severity={f.severity} />, `${f.file}:${f.line}`, f.tool,
          <span key={f.id + "o"} className="font-mono text-[10px] text-orange-300/90">{f.owasp}</span>,
          f.cwe,
          <StatusBadge key={f.id} status={f.status} />, f.autoFix ? "Yes" : "No", f.owner,
        ])}
      />
    </>
  );
}

export function PullRequestsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Auto Fix / Pull Requests" description="PRs opened by Agent Retriever" />
      <DemoTable
        columns={["PR", "Title", "Repo", "Finding", "Status", "CI", "Reviewer"]}
        rows={pullRequests.map((p) => [
          p.id, p.title, p.repo, p.finding, <StatusBadge key={p.id} status={p.status} />,
          <StatusBadge key={p.id + "c"} status={p.ciStatus} />, p.reviewer,
        ])}
      />
      <div className="glass-card mt-4 p-4">
        <h3 className="font-semibold text-white">PR-45: Add login abuse protection</h3>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-400">
          <li>Add rate limit</li><li>Add failed login counter</li><li>Add suspicious login log</li><li>Add unit test</li>
        </ul>
      </div>
    </>
  );
}

export function PipelineGateView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Pipeline Security Gate" description="Control deploy blocking by severity" />
      <DemoTable
        columns={["Severity", "Policy", "Status"]}
        rows={[
          ["Low", "Comment only", <StatusBadge key="1" status="Enabled" />],
          ["Medium", "Create issue", <StatusBadge key="2" status="Enabled" />],
          ["High", "Block deploy", <StatusBadge key="3" status="Enabled" />],
          ["Critical", "Block + notify + PR", <StatusBadge key="4" status="Enabled" />],
        ]}
      />
    </>
  );
}

export function PipelineRunsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Pipeline Runs" description="Scan results on every push" />
      <DemoTable
        columns={["Commit", "Branch", "Author", "Status", "Findings", "Deploy", "Time"]}
        rows={[
          ["a3f2c1d", "main", "somchai", <StatusBadge status="Passing" />, "0", "Allowed", "10:22"],
          ["b8e1f0a", "fix/login", "nattaya", <StatusBadge status="Passing" />, "1 med", "Allowed", "09:15"],
          ["c4d9e2b", "feature/x", "dev1", <StatusBadge status="Failed" />, "1 high", "Blocked", "Yesterday"],
        ]}
      />
    </>
  );
}

export function ExceptionsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Security Exceptions" description="Temporary allow / false positive" actions={<DemoButton>Create Exception</DemoButton>} />
      <DemoTable
        columns={["Rule", "Reason", "Expires", "Approver", "Status"]}
        rows={[
          ["F-099 legacy API", "Legacy system EOL Q3", "2026-09-01", "CTO", <StatusBadge status="Active" />],
        ]}
      />
    </>
  );
}

export function AlertCenterView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Alert Center" description="Wazuh, app logs, web logs" actions={<DemoButton href="/demo/incidents">Create Incident</DemoButton>} />
      <DemoTable
        columns={["Time", "Severity", "Source", "Rule", "Endpoint", "IP", "Message"]}
        rows={[
          ["11:32", <SeverityBadge severity="high" />, "Wazuh", "5710", "it-laptop-02", "—", "Suspicious PowerShell"],
          ["11:05", <SeverityBadge severity="medium" />, "Wazuh", "5503", "srv-prod-02", "203.150.10.88", "Auth failures"],
        ]}
      />
    </>
  );
}

export function LogSourcesView() {
  const sources = ["Wazuh", "Nginx", "Application logs", "Container logs", "Auth logs"];
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Log Sources" description="Manage log ingestion" actions={<DemoButton>Add Source</DemoButton>} />
      <div className="grid gap-3 sm:grid-cols-2">
        {sources.map((s) => (
          <div key={s} className="glass-card flex items-center justify-between p-4">
            <span className="text-white">{s}</span>
            <StatusBadge status="Connected" />
          </div>
        ))}
      </div>
    </>
  );
}

export function DetectionRulesView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Detection Rules" description="Wazuh rules mapped to MITRE & playbooks" />
      <DemoTable
        columns={["Rule ID", "Description", "MITRE", "Playbook", "Severity"]}
        rows={[
          ["5710", "Suspicious PowerShell", "T1059", "Isolate Host", <SeverityBadge severity="high" />],
          ["5503", "Auth failures", "T1110", "Block IP", <SeverityBadge severity="medium" />],
          ["31151", "Brute force", "T1110", "Block IP", <SeverityBadge severity="critical" />],
        ]}
      />
    </>
  );
}

export function PendingApprovalsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Pending Approvals" description="Human-in-the-loop — required for high-impact actions" />
      <DemoTable
        columns={["Action", "Incident", "Impact", "Target", "Reason", "Agent", "Time", ""]}
        rows={[
          ["Block IP", "INC-2026-039", <SeverityBadge severity="medium" />, "203.150.10.88", "Failed logins", "Bangkaew", "11:06", <><DemoButton>Approve</DemoButton> <DemoButton variant="ghost">Deny</DemoButton></>],
          ["Isolate host", "INC-2026-041", <SeverityBadge severity="high" />, "it-laptop-02", "PowerShell", "Shepherd", "09:25", <><DemoButton>Approve</DemoButton> <DemoButton variant="ghost">Deny</DemoButton></>],
        ]}
      />
    </>
  );
}

export function ApprovalPolicyView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Approval Policy" />
      <DemoTable
        columns={["Action", "Approval"]}
        rows={[
          ["Notify only", "Auto"], ["Create ticket", "Auto"], ["Collect evidence", "Auto"],
          ["Block IP", "Manual"], ["Isolate host", "Manual"], ["Freeze deployment", "Manual"],
          ["Customer notification", "Manual"], ["Legal report", "Manual"],
        ]}
      />
    </>
  );
}

export function ApprovalHistoryView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Approval History" actions={<DemoButton variant="secondary">Export Audit</DemoButton>} />
      <DemoTable
        columns={["Time", "Action", "Approver", "Result", "Incident"]}
        rows={[
          ["02:05", "Block IP", "Somchai", "Approved", "INC-2026-042"],
          ["02:04", "Notify admin", "Auto", "Approved", "INC-2026-042"],
        ]}
      />
    </>
  );
}

export function PlaybookCatalogView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Playbook Catalog" description="Shuffle playbooks triggered by K9" />
      <DemoTable
        columns={["Playbook", "Description", "Impact", "Approval", "Mapped Incidents"]}
        rows={[
          ["Notify Admin", "Email/LINE alert", <SeverityBadge severity="low" />, "No", "All"],
          ["Block IP", "Firewall rule", <SeverityBadge severity="high" />, "Yes", "Brute Force"],
          ["Isolate Host", "Network isolate", <SeverityBadge severity="high" />, "Yes", "Malware"],
          ["Open Hotfix PR", "Retriever fix", <SeverityBadge severity="medium" />, "Yes", "CVE"],
        ]}
      />
    </>
  );
}

export function PlaybookRunsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Playbook Runs" />
      <DemoTable
        columns={["Run ID", "Playbook", "Incident", "Status", "Started", "Result"]}
        rows={[
          ["RUN-88", "Block IP", "INC-2026-042", <StatusBadge status="Success" />, "02:06", "IP blocked 24h"],
          ["RUN-87", "Notify Admin", "INC-2026-042", <StatusBadge status="Success" />, "02:05", "Sent LINE+Email"],
          ["RUN-86", "Collect Evidence", "INC-2026-041", <StatusBadge status="Running" />, "09:26", "In progress..."],
        ]}
      />
    </>
  );
}

export function ActionTemplatesView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Action Templates" description="AI selects from catalog only — never raw commands" />
      <div className="glass-card p-4 font-mono text-xs text-slate-300">
        <p className="text-cyan-400">Action ID: block_ip</p>
        <p className="mt-2">Params: ip_address, duration, reason</p>
        <p className="mt-2">Impact: High · Approval: Required</p>
      </div>
    </>
  );
}

export function AttackSimulationView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Attack Simulation" description="Kali / Caldera / Atomic Red Team" actions={<DemoButton>Run Simulation</DemoButton>} />
      <div className="grid gap-3 sm:grid-cols-2">
        {["Brute force", "Suspicious process", "File tampering", "Web login abuse", "Secret leakage"].map((s) => (
          <div key={s} className="glass-card flex items-center justify-between p-4">
            <span className="text-white">{s}</span>
            <DemoButton variant="secondary">Run</DemoButton>
          </div>
        ))}
      </div>
    </>
  );
}

export function ValidationRunsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Validation Runs" />
      <DemoTable
        columns={["Scenario", "Technique", "Detected", "Detect Time", "Response", "Status"]}
        rows={[
          ["Brute force", "T1110", "Yes", "12s", "3m", <StatusBadge status="Pass" />],
          ["PowerShell", "T1059", "Yes", "8s", "—", <StatusBadge status="Pass" />],
          ["Lateral movement", "T1021", "No", "—", "—", <StatusBadge status="Fail" />],
        ]}
      />
    </>
  );
}

export function MitreCoverageView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="MITRE ATT&CK Coverage Map" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { tactic: "Initial Access", covered: 3, total: 5 },
          { tactic: "Execution", covered: 4, total: 6 },
          { tactic: "Credential Access", covered: 4, total: 5 },
          { tactic: "Defense Evasion", covered: 2, total: 5 },
          { tactic: "Impact", covered: 3, total: 4 },
        ].map((t) => (
          <div key={t.tactic} className="glass-card p-4">
            <p className="text-sm font-medium text-white">{t.tactic}</p>
            <div className="mt-2 h-2 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(t.covered / t.total) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{t.covered}/{t.total} techniques</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function ScorecardView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Security Scorecard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Detection Rate", value: "92%" },
          { label: "Response Rate", value: "88%" },
          { label: "MTTR", value: "3m 24s" },
          { label: "MTTD", value: "12s" },
          { label: "MITRE Coverage", value: "67%" },
          { label: "High Risk Open", value: "3" },
        ].map((m) => (
          <div key={m.label} className="glass-card p-4">
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function ExecutiveReportsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Executive Reports" actions={<DemoButton>Generate PDF</DemoButton>} />
      <div className="grid gap-3 sm:grid-cols-2">
        {["Weekly Security Summary", "Monthly Posture", "Incident Executive Summary", "Risk Trend"].map((r) => (
          <div key={r} className="glass-card flex items-center justify-between p-4">
            <span className="text-white">{r}</span>
            <DemoButton variant="secondary">Generate</DemoButton>
          </div>
        ))}
      </div>
    </>
  );
}

export function IncidentReportView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Incident Report" description="Post-incident report for stakeholders" actions={<DemoButton>Export DOCX</DemoButton>} />
      <div className="glass-card space-y-3 p-6 text-sm text-slate-300">
        <section><h3 className="font-semibold text-white">What happened</h3><p>Brute force attack on executive PC from foreign IP.</p></section>
        <section><h3 className="font-semibold text-white">Actions taken</h3><p>IP blocked, admin notified, evidence collected, PR opened.</p></section>
        <section><h3 className="font-semibold text-white">Root cause</h3><p>Weak password policy on executive account.</p></section>
      </div>
    </>
  );
}

export function LegalPdpaView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Legal / PDPA Assessment" description="Draft assistance — not legal advice" />
      <div className="glass-card space-y-2 p-4 text-sm">
        <p><span className="text-slate-500">Personal data involved?</span> <span className="text-amber-300">Possible — login metadata</span></p>
        <p><span className="text-slate-500">Notification required?</span> <span className="text-slate-300">Assess with legal counsel</span></p>
        <DemoButton variant="secondary">Draft Customer Notification</DemoButton>
      </div>
    </>
  );
}

export function EvidenceVaultView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Evidence Vault" actions={<DemoButton variant="secondary">Download Bundle</DemoButton>} />
      <DemoTable
        columns={["Type", "Description", "Hash", "Incident"]}
        rows={[
          ["Raw alert", "Wazuh rule 31151", "sha256:a3f2...", "INC-2026-042"],
          ["Log snapshot", "auth.log excerpt", "sha256:b8e1...", "INC-2026-042"],
          ["Playbook result", "Block IP success", "sha256:c4d9...", "INC-2026-042"],
        ]}
      />
    </>
  );
}

export function SecurityChatView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Security Chat" description="Ask in plain language — powered by Agent Bangkaew" />
      <div className="glass-card mb-4 max-h-96 space-y-4 overflow-y-auto p-4">
        <div className="flex justify-end"><div className="rounded-lg bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100">Is the system secure right now?</div></div>
        <div className="flex justify-start"><div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">Score 84/100, Medium risk. 0 active incidents. 2 pending approvals.</div></div>
        <div className="flex justify-end"><div className="rounded-lg bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100">Which PR should we merge first?</div></div>
        <div className="flex justify-start"><div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">PR-45 (login rate limit) — fixes medium finding F-104, CI passing.</div></div>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Ask about incidents, endpoints, repos..." readOnly />
        <DemoButton>Send</DemoButton>
      </div>
    </>
  );
}

export function AgentWorkspaceView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Agent Workspace" description="K9 pack agents and their current tasks" />
      <DemoTable
        columns={["Agent", "Role", "Status", "Current Task", "Confidence", "Last Output"]}
        rows={[
          ["Bangkaew", "Pack Leader", <StatusBadge status="Idle" />, "—", "92%", "Posture: Medium"],
          ["Shepherd", "Watchdog", <StatusBadge status="Working" />, "INC-2026-039", "88%", "Correlating alerts"],
          ["Retriever", "Fixer", <StatusBadge status="Working" />, "PR-44", "85%", "CVE patch ready"],
          ["Collie", "Handler", <StatusBadge status="Waiting Approval" />, "Isolate host", "95%", "Awaiting approve"],
          ["Pitbull", "Red Team", <StatusBadge status="Idle" />, "—", "90%", "Last sim: 12s detect"],
        ]}
      />
    </>
  );
}

export function UsersRolesView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Users & Roles" actions={<DemoButton>Add User</DemoButton>} />
      <DemoTable
        columns={["User", "Email", "Role", "Last Login"]}
        rows={[
          ["Somchai", "somchai@acme.co", "Admin", "Today"],
          ["Nattaya", "nattaya@acme.co", "Analyst", "Today"],
          ["CEO Office", "ceo@acme.co", "Executive", "Yesterday"],
          ["Dev Team", "dev@acme.co", "Developer", "Today"],
        ]}
      />
    </>
  );
}

export function AdminIntegrationsView() {
  return <IntegrationHealthView />;
}

export function PoliciesView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Policies" />
      <DemoTable
        columns={["Policy", "Value"]}
        rows={[
          ["Approval policy", "High impact = manual"], ["Severity mapping", "Wazuh default + overrides"],
          ["Auto action", "Notify/ticket only"], ["Deploy blocking", "High+ blocked"], ["Evidence retention", "365 days"],
        ]}
      />
    </>
  );
}

export function AuditLogsView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Audit Logs" actions={<DemoButton variant="secondary">Export</DemoButton>} />
      <DemoTable
        columns={["Time", "Actor", "Action", "Target", "Correlation ID"]}
        rows={[
          ["11:06", "Bangkaew", "Recommend block IP", "203.150.10.88", "corr-901"],
          ["11:06", "Somchai", "Approved block IP", "203.150.10.88", "corr-901"],
          ["02:06", "Collie", "Executed playbook", "Block IP", "corr-882"],
        ]}
      />
    </>
  );
}

export function LicenseView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="License / Billing" />
      <div className="glass-card p-4">
        <p className="text-sm text-slate-400">Plan: <span className="text-white">Startup</span></p>
        <p className="text-sm text-slate-400">Endpoints: <span className="text-white">10 / 25</span></p>
        <p className="text-sm text-slate-400">Expires: <span className="text-white">2027-06-25</span></p>
      </div>
    </>
  );
}

export function SystemHealthView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="System Health" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["FastAPI", "Redis", "PostgreSQL", "Qdrant", "Wazuh", "Shuffle", "Worker", "Queue"].map((s) => (
          <div key={s} className="glass-card flex items-center justify-between p-4">
            <span className="text-white">{s}</span>
            <StatusBadge status="Connected" />
          </div>
        ))}
      </div>
    </>
  );
}