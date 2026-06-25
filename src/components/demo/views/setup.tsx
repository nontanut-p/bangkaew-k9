"use client";

import {
  DemoBanner,
  DemoButton,
  DemoPageHeader,
  DemoTable,
  StatusBadge,
} from "@/components/demo/ui";
import { checklistItems, integrations, setupSteps } from "@/lib/demo/mock-data";

export function SetupWizardView() {
  const done = setupSteps.filter((s) => s.done).length;
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="First-Time Setup Wizard"
        description={`Step ${done} of ${setupSteps.length} complete — resume anytime`}
      />
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
          style={{ width: `${(done / setupSteps.length) * 100}%` }}
        />
      </div>
      <div className="space-y-3">
        {setupSteps.map((s) => (
          <div
            key={s.step}
            className="glass-card flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${s.done ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"}`}
              >
                {s.done ? "✓" : s.step}
              </span>
              <span className="text-white">{s.title}</span>
            </div>
            {!s.done && (
              <DemoButton variant="secondary">{s.step === 10 ? "Run Scan" : "Configure"}</DemoButton>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export function IntegrationHealthView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader
        title="Integration Health Check"
        description="Verify all external systems are connected"
        actions={<DemoButton variant="secondary">Ping All</DemoButton>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => (
          <div key={i.name} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{i.name}</h3>
              <StatusBadge status={i.status} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Last sync: {i.lastSync}</p>
            {i.detail && <p className="text-xs text-slate-400">{i.detail}</p>}
            <div className="mt-3 flex gap-2">
              <DemoButton variant="ghost">Reconnect</DemoButton>
              <DemoButton variant="ghost">View Log</DemoButton>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function ChecklistView() {
  return (
    <>
      <DemoBanner />
      <DemoPageHeader title="Quick Start Checklist" description="What you still need to do" />
      <div className="glass-card divide-y divide-white/5">
        {checklistItems.map((item) => (
          <label
            key={item.label}
            className="flex cursor-pointer items-center gap-3 p-4 hover:bg-white/[0.02]"
          >
            <input type="checkbox" checked={item.done} readOnly className="rounded" />
            <span className={item.done ? "text-slate-500 line-through" : "text-white"}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}
