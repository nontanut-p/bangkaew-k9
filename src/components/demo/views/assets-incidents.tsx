"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DemoBanner,
  DemoButton,
  DemoPageHeader,
  DemoTable,
  SeverityBadge,
  StatusBadge,
} from "@/components/demo/ui";
import { endpoints, incidents, incidentTimeline } from "@/lib/demo/mock-data";

export function EndpointInventoryView() {
  const router = useRouter();
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="Endpoint Inventory"
        description="All protected machines — synced from Wazuh"
        actions={
          <>
            <DemoButton href="/demo/assets/deploy">Deploy Agent</DemoButton>
            <DemoButton variant="secondary">Sync from Wazuh</DemoButton>
          </>
        }
      />
      <DemoTable
        columns={["Hostname", "IP", "OS", "Agent ID", "Status", "Risk", "Last Seen", "Owner"]}
        rows={endpoints.map((e) => [
          e.hostname,
          e.ip,
          e.os,
          e.agentId,
          <StatusBadge key={e.id} status={e.status} />,
          <SeverityBadge key={e.id} severity={e.riskLevel} />,
          e.lastSeen,
          e.owner,
        ])}
        onRowClick={(i) => router.push(`/demo/assets/${endpoints[i].id}`)}
      />
    </>
  );
}

export function EndpointDetailView({ id }: { id: string }) {
  const ep = endpoints.find((e) => e.id === id) ?? endpoints[0];
  const tabs = ["Overview", "Alerts", "Processes", "Vulnerabilities", "Timeline"];
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title={ep.hostname}
        description={`${ep.ip} · ${ep.os} · Agent ${ep.agentId}`}
        actions={
          <>
            <DemoButton variant="secondary">Open in Wazuh</DemoButton>
            <DemoButton>Propose Isolate</DemoButton>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <span
            key={t}
            className={`rounded-lg px-3 py-1 text-xs ${i === 0 ? "bg-cyan-500/10 text-cyan-300" : "text-slate-500"}`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-white">Overview</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd><StatusBadge status={ep.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Risk</dt><dd><SeverityBadge severity={ep.riskLevel} /></dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Group</dt><dd className="text-slate-300">{ep.group}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Owner</dt><dd className="text-slate-300">{ep.owner}</dd></div>
          </dl>
        </div>
        <div className="glass-card p-4">
          <h3 className="font-semibold text-white">Recent Alerts</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-400">
            <li>11:32 — Suspicious PowerShell (High)</li>
            <li>09:15 — Auth failure x3 (Medium)</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export function DeployAgentView() {
  const platforms = ["Windows", "Linux", "macOS", "Docker", "Kubernetes", "Bulk"];
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Deploy Agent" description="Install Wazuh agent on endpoints" />
      <div className="mb-4 flex flex-wrap gap-2">
        {platforms.map((p, i) => (
          <span key={p} className={`rounded-lg px-3 py-1 text-xs ${i === 1 ? "bg-cyan-500/10 text-cyan-300" : "border border-white/10 text-slate-400"}`}>
            {p}
          </span>
        ))}
      </div>
      <div className="glass-card p-4">
        <p className="text-sm text-slate-400">One-line install (Linux):</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-emerald-300">
          curl -s https://k9.bangkaew.dev/agent | WAZUH_MANAGER=&apos;10.0.1.5&apos; bash
        </pre>
        <div className="mt-3 flex gap-2">
          <DemoButton>Copy Command</DemoButton>
          <DemoButton variant="secondary">Download Installer</DemoButton>
          <DemoButton variant="secondary">Upload CSV Inventory</DemoButton>
        </div>
      </div>
    </>
  );
}

export function IncidentListView() {
  const router = useRouter();
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="Incident List"
        description="Core of Bangkaew K9 — AI-triaged security incidents"
        actions={<DemoButton href="/demo/incidents/war-room">War Room</DemoButton>}
      />
      <DemoTable
        columns={["ID", "Title", "Severity", "Status", "Endpoint", "Source IP", "Agent", "Pending"]}
        rows={incidents.map((inc) => [
          inc.id,
          inc.title,
          <SeverityBadge key={inc.id} severity={inc.severity} />,
          <StatusBadge key={inc.id} status={inc.status} />,
          inc.endpoint,
          inc.sourceIp,
          inc.assignedAgent,
          inc.pendingAction,
        ])}
        onRowClick={(i) => router.push(`/demo/incidents/${incidents[i].id}`)}
      />
    </>
  );
}

export function IncidentDetailView({ id }: { id: string }) {
  const inc = incidents.find((i) => i.id === id) ?? incidents[0];
  const tabs = ["Overview", "Timeline", "Evidence", "AI Analysis", "Actions", "Code Fix", "Reports"];
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title={inc.title}
        description={`${inc.id} · ${inc.createdAt}`}
        actions={
          <>
            <DemoButton href="/demo/approvals/pending">Approve Action</DemoButton>
            <DemoButton variant="secondary">Generate Report</DemoButton>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <span key={t} className={`rounded-lg px-3 py-1 text-xs ${i === 0 ? "bg-cyan-500/10 text-cyan-300" : "text-slate-500"}`}>{t}</span>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-white">AI Summary</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Multiple failed login attempts detected from foreign IP {inc.sourceIp} targeting {inc.endpoint}.
            Pattern matches brute force (MITRE T1110). Recommend block IP and notify admin.
          </p>
          <p className="mt-2 text-xs text-cyan-400">Confidence: 94% · Agent Bangkaew</p>
        </div>
        <div className="glass-card p-4">
          <h3 className="font-semibold text-white">Timeline</h3>
          <ul className="mt-2 space-y-2">
            {incidentTimeline.map((e) => (
              <li key={e.time} className="flex gap-3 text-xs">
                <span className="font-mono text-cyan-400/70">{e.time}</span>
                <span className="text-slate-400">{e.event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function WarRoomView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="War Room Mode" description="Command center for major incidents" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white">Timeline</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            {incidentTimeline.slice(0, 5).map((e) => (
              <li key={e.time}>{e.time} — {e.event}</li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white">Current Status</h3>
          <SeverityBadge severity="high" />
          <p className="mt-2 text-sm text-slate-300">INC-2026-041 — Investigating PowerShell on it-laptop-02</p>
        </div>
        <div className="glass-card p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white">Pending Actions</h3>
          <DemoButton href="/demo/approvals/pending">Isolate host — Approve?</DemoButton>
        </div>
      </div>
    </>
  );
}
