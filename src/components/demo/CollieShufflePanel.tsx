"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  collieActionCatalog,
  collieBangkaewReports,
  collieMonitorSummary,
  collieReportKindLabel,
  collieReportKindStyle,
  getShuffleModulesByCategory,
  shuffleCategories,
  shuffleModules,
  shuffleModulesDisabled,
  type CollieActionTemplate,
  type ShuffleModule,
  type ShuffleTab,
} from "@/lib/demo/collie-shuffle";
import { playbookRuns, playbooks } from "@/lib/demo/mock-data";
import { usePackDemo } from "@/lib/demo/pack-demo-store";
import { DemoTable, SeverityBadge, StatusBadge } from "@/components/demo/ui";
import { cn } from "@/lib/demo/cn";

const BANGKAEW_HREF = "/demo/pack/bangkaew";

function MetricPill({ metric }: { metric: ShuffleModule["metrics"][0] }) {
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

function ActionRequestButton({
  action,
  pending,
  onRequest,
}: {
  action: CollieActionTemplate;
  pending: boolean;
  onRequest: (id: string) => void;
}) {
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => onRequest(action.id)}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
        pending
          ? "cursor-not-allowed border-violet-500/10 bg-violet-500/5 opacity-60"
          : "border-violet-500/20 bg-violet-500/5 hover:border-violet-400/40 hover:bg-violet-500/10"
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-white">{action.label}</p>
        <p className="truncate text-[10px] text-slate-400">
          {action.target} · {action.impact} impact
        </p>
      </div>
      <span className="shrink-0 text-[10px] font-semibold text-violet-400">
        {pending ? "Pending…" : "Request →"}
      </span>
    </button>
  );
}

function ModuleCard({
  module,
  pendingCollieActions,
  onRequest,
}: {
  module: ShuffleModule;
  pendingCollieActions: string[];
  onRequest: (id: string) => void;
}) {
  const statusLabel =
    module.status === "active" ? "Active" : module.status === "partial" ? "Partial" : "Disabled";
  const moduleActions = collieActionCatalog.filter((a) => a.moduleId === module.id);

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{module.icon}</span>
          <div>
            <p className="font-medium text-white">{module.name}</p>
            <p className="text-xs text-slate-500">{module.capability}</p>
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

      {module.playbooks.length > 0 && (
        <p className="mb-2 text-[10px] text-slate-500">
          Playbooks: {module.playbooks.join(" · ")}
        </p>
      )}

      {module.lastReport && (
        <div className="mb-3 rounded-lg border border-white/5 bg-navy-950/50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-400/80">
            → Bangkaew · {collieReportKindLabel[module.lastReport.kind]}
          </p>
          <p className="text-xs font-medium text-white">{module.lastReport.title}</p>
          <p className="text-[11px] text-slate-400">{module.lastReport.detail}</p>
        </div>
      )}

      {moduleActions.length > 0 ? (
        <div className="space-y-2">
          {moduleActions.map((action) => (
            <ActionRequestButton
              key={action.id}
              action={action}
              pending={pendingCollieActions.includes(action.id)}
              onRequest={onRequest}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-600">Armed — executes only after Bangkaew approval</p>
      )}
    </div>
  );
}

function OverviewPanel({
  pendingCollieActions,
  collieJob,
  onRequest,
}: {
  pendingCollieActions: string[];
  collieJob: ReturnType<typeof usePackDemo>["collieJob"];
  onRequest: (id: string) => void;
}) {
  const { inboxItems } = usePackDemo();
  const s = collieMonitorSummary;
  const pendingApprovals = inboxItems.filter((i) => i.type === "approval" && i.sources.includes("collie"));

  return (
    <div className="space-y-6">
      <div className="glass-card border-violet-500/25 p-4">
        <p className="text-sm font-medium text-violet-200">
          ✋ Approval gate active — Collie never auto-runs. Every playbook sends a request to Bangkaew first.
        </p>
        <Link href={BANGKAEW_HREF} className="mt-2 inline-block text-xs text-cyan-400 hover:underline">
          Open Bangkaew to approve →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-violet-400">{s.playbooksArmed}</p>
          <p className="text-xs text-slate-500">Playbooks armed</p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-amber-400">{pendingApprovals.length || s.pendingApproval}</p>
          <p className="text-xs text-slate-500">Pending Bangkaew approval</p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-white">{s.runsToday}</p>
          <p className="text-xs text-slate-500">Runs today</p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-2xl font-bold text-emerald-400">
            {s.modulesActive}/{s.modulesTotal}
          </p>
          <p className="text-xs text-slate-500">Shuffle modules active</p>
        </div>
      </div>

      {collieJob && (
        <div className="glass-card border-violet-500/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-violet-200">
              {collieJob.phase === "awaiting_approval"
                ? "Awaiting Bangkaew approval"
                : collieJob.phase === "executing"
                  ? "Executing playbook"
                  : "Completed"}
            </p>
            {collieJob.phase === "executing" && (
              <span className="font-mono text-xs text-violet-400">{collieJob.progress}%</span>
            )}
          </div>
          <p className="mt-1 text-sm text-white">
            {collieJob.action.playbook} · {collieJob.action.target}
          </p>
          {collieJob.phase === "executing" && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-900">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${collieJob.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Armed & ready</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Connected apps</span>
              <span className="text-white">{s.connectedApps} security integrations</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Approval gate</span>
              <span className="text-violet-300">{s.approvalGate} via Bangkaew</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Playbook catalog</span>
              <span className="text-white">{playbooks.length} playbooks</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Auto-run</span>
              <span className="text-red-300">Disabled</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Reports & requests → Bangkaew</h3>
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {collieBangkaewReports.map((r) => (
              <li key={r.id} className={cn("rounded-lg border px-3 py-2", collieReportKindStyle[r.kind])}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase">{collieReportKindLabel[r.kind]}</span>
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
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Request playbook — sends to Bangkaew for approval</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {collieActionCatalog.map((action) => (
            <ActionRequestButton
              key={action.id}
              action={action}
              pending={pendingCollieActions.includes(action.id)}
              onRequest={onRequest}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Recent playbook runs</h3>
        <DemoTable
          columns={["Playbook", "Incident", "Status", "Result"]}
          rows={playbookRuns.map((r) => [
            r.playbook,
            r.incident,
            <StatusBadge key={r.id} status={r.status} />,
            r.result,
          ])}
        />
      </div>
    </div>
  );
}

function DisabledModulesStrip() {
  return (
    <div className="glass-card border-dashed border-white/10 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Not configured ({shuffleModulesDisabled.length}/{collieMonitorSummary.modulesTotal})
      </p>
      <div className="flex flex-wrap gap-2">
        {shuffleModulesDisabled.map((m) => (
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

export function CollieShufflePanel() {
  const { collieJob, pendingCollieActions, requestCollieAction } = usePackDemo();
  const [tab, setTab] = useState<ShuffleTab>("Overview");

  const moduleTabs = useMemo(
    () =>
      shuffleModules.map((m) => ({
        id: m.id,
        label: m.shortName,
        category: m.category,
      })),
    []
  );

  const activeModule = shuffleModules.find((m) => m.id === tab);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Shuffle SOAR — {collieMonitorSummary.modulesActive} of {collieMonitorSummary.modulesTotal} modules active.
        Every action requires Bangkaew approval before execution.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {shuffleCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setTab(cat)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === cat
                ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

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
                    ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                    : "border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"
                )}
              >
                {m.label}
              </button>
            ))}
        </div>
      )}

      {tab === "Overview" && (
        <div className="flex flex-wrap gap-1.5">
          {moduleTabs.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTab(m.id)}
              className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[10px] text-slate-400 transition-colors hover:border-violet-500/20 hover:text-violet-300"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {tab === "Overview" && (
        <OverviewPanel
          pendingCollieActions={pendingCollieActions}
          collieJob={collieJob}
          onRequest={requestCollieAction}
        />
      )}
      {activeModule && (
        <ModuleCard
          module={activeModule}
          pendingCollieActions={pendingCollieActions}
          onRequest={requestCollieAction}
        />
      )}
      {!activeModule && tab !== "Overview" && (
        <div className="grid gap-4 md:grid-cols-2">
          {getShuffleModulesByCategory(tab).map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              pendingCollieActions={pendingCollieActions}
              onRequest={requestCollieAction}
            />
          ))}
        </div>
      )}

      <DisabledModulesStrip />

      <CollieLiveActionsLog />
    </div>
  );
}

function CollieLiveActionsLog() {
  const [actions, setActions] = useState<
    { id: number; playbook_id: string; target: string; status: string; trigger_source: string; created_at: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/collie/actions")
      .then((r) => r.json())
      .then((d) => setActions(d.actions ?? []));
    const es = new EventSource("/api/stream");
    es.addEventListener("collie_action", () => {
      fetch("/api/collie/actions")
        .then((r) => r.json())
        .then((d) => setActions(d.actions ?? []));
    });
    return () => es.close();
  }, []);

  if (actions.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white">Recent automation log (live)</h3>
      <DemoTable
        columns={["Time", "Trigger", "Playbook", "Target", "Status"]}
        rows={actions.slice(0, 10).map((a) => [
          new Date(a.created_at).toLocaleTimeString("en-GB"),
          a.trigger_source,
          a.playbook_id.replace(/_/g, " "),
          a.target,
          a.status === "success" ? "✅ Success" : a.status === "pending" ? "⏳ Pending" : a.status,
        ])}
      />
    </div>
  );
}
