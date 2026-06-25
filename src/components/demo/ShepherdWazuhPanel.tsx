"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getModulesByCategory,
  reportKindLabel,
  reportKindStyle,
  shepherdBangkaewReports,
  shepherdMonitorSummary,
  wazuhCategories,
  wazuhModules,
  wazuhModulesDisabled,
  type WazuhModule,
  type WazuhTab,
} from "@/lib/demo/shepherd-wazuh";
import { alerts, endpoints } from "@/lib/demo/mock-data";
import { usePackDemo } from "@/lib/demo/pack-demo-store";
import { DemoTable, SeverityBadge, StatusBadge } from "@/components/demo/ui";
import { cn } from "@/lib/demo/cn";

const BANGKAEW_HREF = "/demo/pack/bangkaew";

function MetricPill({ metric }: { metric: WazuhModule["metrics"][0] }) {
  const color =
    metric.status === "critical"
      ? "text-red-300"
      : metric.status === "warn"
        ? "text-amber-300"
        : "text-slate-300";

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{metric.label}</p>
      <p className={cn("text-sm font-semibold", color)}>{metric.value}</p>
    </div>
  );
}

function ModuleCard({ module }: { module: WazuhModule }) {
  const statusLabel =
    module.status === "active" ? "Active" : module.status === "partial" ? "Partial" : "Disabled";

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{module.icon}</span>
          <div>
            <p className="font-medium text-white">{module.name}</p>
            <p className="text-xs text-slate-500">{module.monitoring}</p>
          </div>
        </div>
        <StatusBadge status={statusLabel} />
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {module.scope.map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/5 bg-navy-900/60 px-2 py-0.5 text-[10px] text-slate-400"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {module.metrics.map((m) => (
          <MetricPill key={m.label} metric={m} />
        ))}
      </div>

      {module.lastReport ? (
        <div className="rounded-lg border border-white/5 bg-navy-950/50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-400/80">
            → Bangkaew · {reportKindLabel[module.lastReport.kind]}
          </p>
          <p className="text-xs font-medium text-white">{module.lastReport.title}</p>
          <p className="text-[11px] text-slate-400">{module.lastReport.detail}</p>
        </div>
      ) : (
        <p className="text-xs text-slate-600">No report sent today</p>
      )}
    </div>
  );
}

function OverviewPanel() {
  const { getReportsForAgent } = usePackDemo();
  const liveReports = getReportsForAgent("shepherd");
  const s = shepherdMonitorSummary;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-cyan-400">{s.agentsOnline}</p>
          <p className="text-xs text-slate-500">Agents online</p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-white">{s.alertsToday}</p>
          <p className="text-xs text-slate-500">Alerts today</p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-orange-400">{s.reportsSent}</p>
          <p className="text-xs text-slate-500">Reports to Bangkaew</p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-emerald-400">
            {s.modulesActive}/{s.modulesTotal}
          </p>
          <p className="text-xs text-slate-500">Wazuh modules active</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Currently monitoring</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Endpoints</span>
              <span className="text-white">{endpoints.length} hosts · {s.agentsOnline} online</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Log throughput</span>
              <span className="text-white">{s.eventsPerHour} events/hr</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Detection rules</span>
              <span className="text-white">{s.rulesActive} active</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Open incidents</span>
              <span className="text-amber-300">3 linked to Bangkaew</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Pending commands</span>
              <span className="text-violet-300">2 awaiting approval</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Reports & commands → Bangkaew</h3>
            <Link href={BANGKAEW_HREF} className="text-xs text-cyan-400 hover:underline">
              Open Bangkaew →
            </Link>
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {shepherdBangkaewReports.map((r) => (
              <li
                key={r.id}
                className={cn("rounded-lg border px-3 py-2", reportKindStyle[r.kind])}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase">{reportKindLabel[r.kind]}</span>
                  <span className="font-mono text-[10px] opacity-70">{r.time}</span>
                </div>
                <p className="text-xs font-medium">{r.title}</p>
                <p className="text-[11px] opacity-80">{r.detail}</p>
                {r.severity && (
                  <div className="mt-1">
                    <SeverityBadge severity={r.severity} />
                  </div>
                )}
              </li>
            ))}
            {liveReports.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-orange-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase">Live report</span>
                  <span className="font-mono text-[10px] opacity-70">{r.time}</span>
                </div>
                <p className="text-xs font-medium">{r.title}</p>
                <p className="text-[11px] opacity-80">{r.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Endpoint status</h3>
        <DemoTable
          columns={["Hostname", "Status", "Risk", "Group", "Last Seen"]}
          rows={endpoints.map((e) => [
            e.hostname,
            <StatusBadge key={e.id} status={e.status} />,
            <SeverityBadge key={e.id + "r"} severity={e.riskLevel} />,
            e.group,
            e.lastSeen,
          ])}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Recent Wazuh alerts</h3>
        <DemoTable
          columns={["Time", "Severity", "Rule", "Endpoint", "Message"]}
          rows={alerts.map((a) => [
            a.time,
            <SeverityBadge key={a.id} severity={a.severity} />,
            a.ruleId,
            a.endpoint,
            a.message,
          ])}
        />
      </div>
    </div>
  );
}

function CategoryPanel({ category }: { category: Exclude<WazuhTab, "Overview"> }) {
  const modules = getModulesByCategory(category);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((m) => (
        <ModuleCard key={m.id} module={m} />
      ))}
    </div>
  );
}

function DisabledModulesStrip() {
  return (
    <div className="glass-card border-dashed border-white/10 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Not configured ({wazuhModulesDisabled.length}/{shepherdMonitorSummary.modulesTotal})
      </p>
      <div className="flex flex-wrap gap-2">
        {wazuhModulesDisabled.map((m) => (
          <span
            key={m.id}
            className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-xs text-slate-600"
          >
            {m.icon} {m.shortName}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ShepherdWazuhPanel() {
  const [tab, setTab] = useState<WazuhTab>("Overview");

  const moduleTabs = useMemo(
    () =>
      wazuhModules.map((m) => ({
        id: m.id,
        label: m.shortName,
        category: m.category,
      })),
    []
  );

  const activeModule = wazuhModules.find((m) => m.id === tab);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Wazuh platform — {shepherdMonitorSummary.modulesActive} of {shepherdMonitorSummary.modulesTotal}{" "}
        modules active. Monitoring summary and reports flow to Bangkaew.
      </p>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {wazuhCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setTab(cat)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === cat
                ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Module sub-menu (when not Overview) */}
      {tab !== "Overview" && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {moduleTabs
            .filter((m) => m.category === tab)
            .map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTab(m.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                  tab === m.id
                    ? "border-blue-500/40 bg-blue-500/15 text-blue-200"
                    : "border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"
                )}
              >
                {m.label}
              </button>
            ))}
        </div>
      )}

      {/* Quick jump to individual modules from Overview */}
      {tab === "Overview" && (
        <div className="flex flex-wrap gap-1.5">
          {moduleTabs.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTab(m.id)}
              className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[10px] text-slate-400 transition-colors hover:border-cyan-500/20 hover:text-cyan-300"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {tab === "Overview" && <OverviewPanel />}
      {activeModule && <ModuleCard module={activeModule} />}
      {!activeModule && tab !== "Overview" && <CategoryPanel category={tab} />}

      <DisabledModulesStrip />
    </div>
  );
}
