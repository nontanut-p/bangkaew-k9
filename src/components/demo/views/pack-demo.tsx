"use client";

import Image from "next/image";
import Link from "next/link";
import { BangkaewCommanderPanel } from "@/components/demo/BangkaewCommanderPanel";
import { PackAgentCard } from "@/components/demo/PackAgentCard";
import { PackAlertFeed, PackReportPipeline } from "@/components/demo/PackAgentAlertPopups";
import {
  PackAgentAvatar,
  PackAgentPortrait,
  PackAgentStateLegend,
  PackAgentStatusLabel,
} from "@/components/demo/PackAgentStatus";
import {
  DemoBanner,
  DemoButton,
  DemoPageHeader,
  DemoTable,
  SeverityBadge,
  StatusBadge,
} from "@/components/demo/ui";
import { cn } from "@/lib/demo/cn";
import {
  getPackAgent,
  packAgents,
  type PackAgentId,
} from "@/lib/demo/pack-agents";
import { usePackAgentStatus, usePackDemo } from "@/lib/demo/pack-demo-store";
import { packReports } from "@/lib/demo/pack-alerts";
import { CollieShufflePanel } from "@/components/demo/CollieShufflePanel";
import { RetrieverPanel } from "@/components/demo/RetrieverPanel";
import { ShepherdWazuhPanel } from "@/components/demo/ShepherdWazuhPanel";
import {
  alerts,
  executiveDashboard,
  incidentTimeline,
  incidents,
  integrations,
  mitreTactics,
} from "@/lib/demo/mock-data";

export function CommandCenterView() {
  const { inboxItems } = usePackDemo();
  const d = executiveDashboard;
  const activeIncident = incidents.find((i) => i.status !== "Resolved") ?? incidents[0];
  const pendingCount = inboxItems.filter((i) => i.type === "approval").length;
  const openIncidents = incidents.filter((i) => i.status !== "Resolved").length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" || a.severity === "high").length;

  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="Pack HQ — Command Center"
        description="Monitor incidents, approve actions, and chat with your pack leader."
        actions={
          pendingCount > 0 ? (
            <DemoButton href="/demo/pack/bangkaew">
              ✋ {pendingCount} pending approval{pendingCount > 1 ? "s" : ""}
            </DemoButton>
          ) : undefined
        }
      />

      {/* Bangkaew Commander — primary interface */}
      <div className="mb-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BangkaewCommanderPanel />
        </div>
        <div className="glass-card flex flex-col justify-center p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-white">📡 Recent activity</h3>
          <PackReportPipeline limit={6} />
        </div>
      </div>

      {/* Security pulse */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-2xl px-5 py-4">
          <p className="text-3xl font-bold text-cyan-400">{d.securityScore}</p>
          <p className="text-xs text-slate-500">Security Score</p>
          <SeverityBadge severity={d.riskLevel} />
        </div>
        <Link href={`/demo/incident/${activeIncident.id}`} className="glass-card rounded-2xl px-5 py-4 hover:border-amber-500/30">
          <p className="text-2xl font-bold text-white">{openIncidents}</p>
          <p className="text-xs text-slate-500">Open Incidents</p>
          <p className="mt-1 truncate text-xs text-slate-400">{activeIncident.title}</p>
        </Link>
        <Link href="/demo/pack/bangkaew" className="glass-card rounded-2xl px-5 py-4 hover:border-violet-500/30">
          <p className="text-2xl font-bold text-violet-400">{pendingCount}</p>
          <p className="text-xs text-slate-500">Pending approvals</p>
          <p className="mt-1 text-xs text-slate-400">Block IP · Isolate host</p>
        </Link>
        <div className="glass-card rounded-2xl px-5 py-4">
          <p className="text-2xl font-bold text-orange-400">{criticalAlerts}</p>
          <p className="text-xs text-slate-500">High/Critical Alerts</p>
          <p className="mt-1 text-xs text-slate-400">{packReports.length} recent reports</p>
        </div>
      </div>

      {/* Live notification strip */}
      <div className="agent-alert-strip mb-6 flex items-center gap-3 overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5">
        <span className="agent-alert-pulse shrink-0 text-lg">🔴</span>
        <p className="min-w-0 flex-1 truncate text-sm text-cyan-100">
          <span className="font-semibold">Live:</span> Brute force detected on exec-laptop-01 · {pendingCount} action{pendingCount !== 1 ? "s" : ""} awaiting approval
        </p>
        <DemoButton href="/demo/pack/bangkaew" variant="secondary">
          Review
        </DemoButton>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
        🐕 The Pack
      </h2>
      <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {packAgents.map((agent) => (
          <PackAgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      <div className="mb-8">
        <PackAgentStateLegend />
      </div>

      {/* Live story + feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-1">
          <h3 className="mb-4 font-semibold text-white">📥 Inbox</h3>
          <PackAlertFeed limit={5} />
          <DemoButton href="/demo/pack/bangkaew" variant="ghost">
            Open chat →
          </DemoButton>
        </div>

        <div className="glass-card p-5 lg:col-span-1">
          <h3 className="mb-4 font-semibold text-white">Incident timeline</h3>
          <ol className="space-y-3">
            {incidentTimeline.map((ev, i) => {
              const agent = packAgents.find((a) =>
                ev.actor?.toLowerCase().includes(a.name.toLowerCase())
              );
              return (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 font-mono text-xs text-slate-600">{ev.time}</span>
                  {agent && (
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                      <Image src={agent.image} alt="" fill className="object-cover object-top" />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-cyan-400/90">{ev.actor}</span>
                    <span className="text-slate-400"> — {ev.event}</span>
                  </div>
                </li>
              );
            })}
          </ol>
          <DemoButton href={`/demo/incident/${incidents[0].id}`} variant="secondary">
            Replay full incident
          </DemoButton>
        </div>

        <div className="lg:col-span-1">
          <BangkaewCommanderPanel compact />
        </div>
      </div>
    </>
  );
}

export function PackAgentView({ agentId }: { agentId: PackAgentId }) {
  const agent = getPackAgent(agentId)!;
  const st = usePackAgentStatus(agentId);

  return (
    <>
      <DemoBanner />
      <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full max-w-[200px] shrink-0 overflow-hidden rounded-2xl">
          <PackAgentPortrait agent={agent} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
            Agent {agent.name} · {agent.role}
          </p>
          <h1 className="text-2xl font-bold text-white">Agent {agent.name}</h1>
          <p className="mt-1 text-sm text-slate-400">{agent.tagline} · {agent.tool}</p>
          <div className="mt-2">
            <PackAgentStatusLabel agentId={agentId} />
            <p className="mt-1 text-sm text-slate-400">{st.task}</p>
          </div>
        </div>
        <DemoButton href="/demo" variant="secondary">
          ← Pack HQ
        </DemoButton>
      </div>

      {agentId === "shepherd" && <ShepherdPanel />}
      {agentId === "bangkaew" && <BangkaewPanel />}
      {agentId === "retriever" && <RetrieverPanel />}
      {agentId === "collie" && <ColliePanel />}
      {agentId === "pitbull" && <PitbullPanel />}
    </>
  );
}

function ShepherdPanel() {
  return <ShepherdWazuhPanel />;
}

function BangkaewPanel() {
  return (
    <div className="space-y-6">
      <BangkaewCommanderPanel />
      <h3 className="text-sm font-semibold text-white">Active incidents</h3>
      <DemoTable
        columns={["Incident", "Severity", "Status", "Pending"]}
        rows={incidents.map((i) => [
          <Link key={i.id} href={`/demo/incident/${i.id}`} className="text-cyan-400 hover:underline">
            {i.title}
          </Link>,
          <SeverityBadge key={i.id + "s"} severity={i.severity} />,
          <StatusBadge key={i.id + "st"} status={i.status} />,
          i.pendingAction,
        ])}
      />
    </div>
  );
}

function ColliePanel() {
  return <CollieShufflePanel />;
}

function PitbullPanel() {
  const covered = mitreTactics.reduce((s, t) => s + t.covered, 0);
  const total = mitreTactics.reduce((s, t) => s + t.total, 0);
  return (
    <div className="space-y-6">
      <div className="glass-card border-red-500/30 p-4">
        <p className="text-sm font-medium text-red-300">Unavailable — Caldera not connected</p>
        <p className="mt-1 text-xs text-slate-400">
          Connect Caldera/Kali in Setup to run attack simulations.
        </p>
        <DemoButton href="/demo/setup" variant="secondary">
          Connect Caldera in Setup
        </DemoButton>
      </div>
      <p className="text-sm text-slate-400">
        Runs safe attack simulations via Kali/Caldera — measures detection and response speed.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">94%</p>
          <p className="text-xs text-slate-500">Detection rate</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">12s</p>
          <p className="text-xs text-slate-500">Avg detection time</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{Math.round((covered / total) * 100)}%</p>
          <p className="text-xs text-slate-500">MITRE coverage</p>
        </div>
      </div>
      <DemoButton>Run safe simulation: Brute force</DemoButton>
      <h3 className="text-sm font-semibold text-white">MITRE ATT&CK coverage</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {mitreTactics.slice(0, 6).map((t) => (
          <div key={t.tactic} className="glass-card flex items-center justify-between px-3 py-2 text-sm">
            <span className="text-slate-300">{t.tactic}</span>
            <span className="text-cyan-400">{t.covered}/{t.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncidentStoryView({ id }: { id: string }) {
  const incident = incidents.find((i) => i.id === id) ?? incidents[0];

  return (
    <>
      <DemoBanner />
      <DemoButton href="/demo" variant="ghost">
        ← Back to Pack HQ
      </DemoButton>
      <DemoPageHeader
        title={incident.title}
        description={`${incident.id} — step-by-step timeline`}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <SeverityBadge severity={incident.severity} />
        <StatusBadge status={incident.status} />
        <span className="text-sm text-slate-400">Endpoint: {incident.endpoint}</span>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-4 font-semibold text-white">Incident timeline — who did what</h3>
        <ol className="relative space-y-6 border-l border-white/10 pl-6">
          {incidentTimeline.map((ev, i) => {
            const agent = packAgents.find((a) =>
              ev.actor?.toLowerCase().includes(a.name.toLowerCase())
            );
            return (
              <li key={i} className="relative">
                {agent && (
                  <div className="absolute -left-[2.15rem] top-0 h-8 w-8 overflow-hidden rounded-full ring-2 ring-cyan-500/50">
                    <Image src={agent.image} alt="" fill className="object-cover object-top" />
                  </div>
                )}
                <p className="font-mono text-xs text-slate-600">{ev.time}</p>
                <p className="font-medium text-white">
                  <span className="text-cyan-400">{ev.actor}</span> — {ev.event}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {incident.status === "Waiting Approval" && (
        <div className="mt-6 glass-card border-violet-500/30 p-5">
          <p className="text-sm text-violet-300">Actions awaiting approval — playbooks ready to run once approved.</p>
          <div className="mt-3 flex gap-2">
            <DemoButton href="/demo/pack/bangkaew">Review & approve</DemoButton>
          </div>
        </div>
      )}
    </>
  );
}

export function SetupView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Setup" description="Connect integrations — one-time setup for the full pack." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {integrations.map((i) => (
          <div key={i.name} className="glass-card p-4">
            <p className="font-medium text-white">{i.name}</p>
            <StatusBadge status={i.status} />
            {i.lastSync !== "—" && <p className="mt-1 text-xs text-slate-500">Sync: {i.lastSync}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
