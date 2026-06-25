"use client";

import Link from "next/link";
import {
  DemoBanner,
  DemoButton,
  DemoPageHeader,
  DemoTable,
  SeverityBadge,
  StatCard,
  StatusBadge,
} from "@/components/demo/ui";
import { executiveDashboard, alerts, agentWorkers } from "@/lib/demo/mock-data";

export function ExecutiveDashboardView() {
  const d = executiveDashboard;
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="Executive Dashboard"
        description="Are we secure right now? — for owners, CTO, CEO, managers"
        actions={
          <>
            <DemoButton href="/demo/incidents">Latest Incident</DemoButton>
            <DemoButton variant="secondary">Download Report</DemoButton>
          </>
        }
      />

      <div className="mb-6 flex items-center gap-6">
        <div className="glass-card flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-cyan-500/30">
          <span className="text-3xl font-bold text-cyan-400">{d.securityScore}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
        <div>
          <p className="text-sm text-slate-400">Security Score</p>
          <SeverityBadge severity={d.riskLevel} />
          <p className="mt-2 text-xs text-slate-500">
            Trend: {d.scoreTrend.join(" → ")}
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Incidents" value={d.activeIncidents} href="/demo/incidents" />
        <StatCard label="Pending Approval" value={d.pendingApproval} href="/demo/approvals/pending" />
        <StatCard label="Open High Risks" value={3} href="/demo/code/findings" />
        <StatCard label="Auto PR Waiting Review" value={1} href="/demo/code/prs" />
        <StatCard label="Protected Endpoints" value={d.protectedEndpoints} href="/demo/assets" />
        <StatCard label="GitHub Repos" value={d.githubRepos} href="/demo/code/repos" />
        <StatCard label="Open Vulnerabilities" value={d.openVulnerabilities} />
        <StatCard label="Mean Time to Detect" value={d.mttd} />
        <StatCard label="Mean Time to Respond" value={d.mttr} />
        <StatCard label="Last Scan" value={d.lastScan} sub="Baseline + runtime" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="mb-3 font-semibold text-white">Protection Modules</h3>
          <ul className="space-y-2">
            {d.protection.map((p) => (
              <li key={p.label} className="flex items-center gap-2 text-sm text-slate-300">
                <span className={p.ok ? "text-emerald-400" : "text-red-400"}>
                  {p.ok ? "✓" : "✗"}
                </span>
                {p.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-3 font-semibold text-white">Last Incident</h3>
          <p className="text-sm text-slate-400">{d.lastIncident}</p>
          <DemoButton href="/demo/incidents/INC-2026-042" variant="secondary">
            View Detail
          </DemoButton>
        </div>
      </div>
    </>
  );
}

export function OperationsDashboardView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="Security Operations Dashboard"
        description="Alerts, incidents, endpoints — for IT, analysts, DevOps"
        actions={<DemoButton href="/demo/runtime/alerts">Alert Center</DemoButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Alerts (24h)" value={alerts.length} />
        <StatCard label="Active Incidents" value={2} href="/demo/incidents" />
        <StatCard label="Endpoints Online" value="8/10" href="/demo/assets" />
        <StatCard label="Failed Playbooks" value={0} href="/demo/playbooks/runs" />
      </div>

      <h3 className="mb-3 text-sm font-semibold text-white">Recent Alerts</h3>
      <DemoTable
        columns={["Time", "Severity", "Endpoint", "Message", "Incident"]}
        rows={alerts.map((a) => [
          a.time,
          <SeverityBadge key={a.id} severity={a.severity} />,
          a.endpoint,
          a.message,
          a.incidentId ? (
            <Link key={a.id} href={`/demo/incidents/${a.incidentId}`} className="text-cyan-400 hover:underline">
              {a.incidentId}
            </Link>
          ) : (
            "—"
          ),
        ])}
      />

      <h3 className="mb-3 mt-6 text-sm font-semibold text-white">Top Attacking IP</h3>
      <DemoTable
        columns={["IP", "Attempts", "Last Seen", "Status"]}
        rows={[
          ["203.150.10.88", "47", "11:05", <StatusBadge key="1" status="Pending block" />],
          ["185.220.101.42", "12", "Yesterday", <StatusBadge key="2" status="Blocked" />],
        ]}
      />
    </>
  );
}
