"use client";

import { useEffect, useState } from "react";
import { DemoButton } from "@/components/demo/ui";
import { cn } from "@/lib/demo/cn";

interface Agent {
  id: number;
  hostname: string;
  ip_address: string;
  os: string;
}

interface Scenario {
  id: string;
  name: string;
  mitreTactic: string;
  description: string;
  risk: string;
  icon: string;
}

interface AttackReport {
  scenario: string;
  scenarioName: string;
  target: string;
  durationSec: number;
  totalEvents: number;
  detectedEvents: number;
  ttd: number;
  ttr: number;
  score: number;
  recommendations: string[];
}

export function PitbullAttackPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState(50);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [confirmed, setConfirmed] = useState(false);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [report, setReport] = useState<AttackReport | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((d) => setAgents(d.agents ?? []));
    fetch("/api/attacks")
      .then((r) => r.json())
      .then((d) => setScenarios(d.scenarios ?? []));
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.addEventListener("attack_progress", (e) => {
      const data = JSON.parse(e.data) as { log?: string; progress?: number; total?: number; status?: string };
      if (data.log) setLogs((prev) => [...prev.slice(-80), data.log!]);
      if (data.progress != null) setProgress({ current: data.progress, total: data.total ?? eventCount });
      if (data.status === "started" || data.status === "running") setRunning(true);
    });
    es.addEventListener("attack_complete", (e) => {
      const data = JSON.parse(e.data) as { report: AttackReport };
      setReport(data.report);
      setRunning(false);
    });
    return () => es.close();
  }, [eventCount]);

  async function startAttack() {
    if (!selected || !targetId || !confirmed) return;
    setLogs([]);
    setReport(null);
    setRunning(true);
    await fetch("/api/attacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: selected.id,
        targetAgentId: targetId,
        eventCount,
        speed,
      }),
    });
  }

  const riskColor = (risk: string) =>
    risk === "CRITICAL" ? "border-red-500/40" : risk === "HIGH" ? "border-orange-500/40" : "border-amber-500/40";

  return (
    <div className="space-y-6">
      <div className="glass-card border-red-500/30 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-red-300">
          ⚠️ Simulated attacks send logs to the Wazuh dashboard (Shepherd). Ensure you have authorization.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Attack Scenario Library</h3>
          <div className="grid gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s)}
                className={cn(
                  "glass-card p-3 text-left transition-colors hover:border-red-400/40",
                  riskColor(s.risk),
                  selected?.id === s.id && "ring-1 ring-red-400/50"
                )}
              >
                <p className="font-medium text-white">
                  {s.icon} {s.id} — {s.name}
                </p>
                <p className="text-xs text-slate-400">MITRE: {s.mitreTactic}</p>
                <p className="mt-1 text-xs text-slate-500">{s.description}</p>
                <p className="mt-1 text-[10px] font-semibold text-red-300">Risk: {s.risk}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-3">
          <div className="glass-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">🎯 Attack configuration</h3>
            {selected ? (
              <div className="space-y-3 text-sm">
                <p>
                  Scenario: <span className="text-red-300">{selected.id} — {selected.name}</span>
                </p>
                <label className="block">
                  <span className="text-xs text-slate-400">Target agent</span>
                  <select
                    className="mt-1 w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-white"
                    value={targetId ?? ""}
                    onChange={(e) => setTargetId(Number(e.target.value))}
                  >
                    <option value="">Select agent…</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.hostname} ({a.ip_address})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-slate-400">Events: {eventCount}</span>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={eventCount}
                    onChange={(e) => setEventCount(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                </label>
                <div className="flex gap-2">
                  {(["slow", "normal", "fast"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-xs capitalize",
                        speed === s ? "border-red-400/50 bg-red-500/10 text-red-200" : "border-white/10 text-slate-400"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  I understand and am authorized to run this simulation
                </label>
                <button
                  type="button"
                  disabled={!targetId || !confirmed || running}
                  onClick={startAttack}
                  className="w-full rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
                >
                  🔴 Start attack simulation
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Select a scenario from the library.</p>
            )}
          </div>

          <div className="glass-card border-red-500/20 bg-navy-950/80 p-4 font-mono text-xs">
            <p className="mb-2 font-sans text-sm font-semibold text-red-300">Live attack log</p>
            <div className="max-h-48 overflow-y-auto space-y-0.5 text-green-400/90">
              {logs.length === 0 ? (
                <p className="text-slate-600">Waiting for simulation…</p>
              ) : (
                logs.map((l, i) => <p key={i}>{l}</p>)
              )}
            </div>
            {progress.total > 0 && (
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-navy-800">
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  {progress.current}/{progress.total} events
                </p>
              </div>
            )}
          </div>

          {report && (
            <div className="glass-card border-cyan-500/20 p-4">
              <h3 className="mb-2 text-sm font-semibold text-cyan-300">📋 Simulation report</h3>
              <div className="grid gap-2 text-xs sm:grid-cols-2">
                <p>
                  Scenario: {report.scenarioName} ({report.scenario})
                </p>
                <p>Target: {report.target}</p>
                <p>Duration: {report.durationSec}s</p>
                <p>
                  Detected: {report.detectedEvents}/{report.totalEvents}
                </p>
                <p>TTD: {report.ttd}s</p>
                <p>TTR: {report.ttr}s</p>
              </div>
              <p className="mt-2 text-lg font-bold text-emerald-400">Score: {report.score}/100</p>
              <ul className="mt-2 list-inside list-disc text-xs text-slate-400">
                {report.recommendations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <DemoButton href="/demo/pack/shepherd" variant="secondary">
                View in Wazuh Dashboard
              </DemoButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
