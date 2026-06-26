"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoTable, SeverityBadge } from "@/components/demo/ui";
import { useDemoStream } from "@/context/DemoStreamProvider";
import { cn } from "@/lib/demo/cn";

interface Kpis {
  totalAgents: number;
  active: number;
  disconnected: number;
  criticalAlerts: number;
  eps: number;
}

interface LiveAlert {
  id: number;
  created_at: string;
  hostname?: string;
  rule_id?: string;
  description?: string;
  severity?: string;
}

interface AgentRow {
  id: number;
  agent_id: string;
  hostname: string;
  os: string;
  ip_address: string;
  status: string;
  last_seen: string;
}

export function WazuhLiveDashboard() {
  const { eps: streamEps } = useDemoStream();
  const [kpis, setKpis] = useState<Kpis>({
    totalAgents: 0,
    active: 0,
    disconnected: 0,
    criticalAlerts: 0,
    eps: 847,
  });
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [chart24h, setChart24h] = useState<{ hour: number; critical: number; medium: number; low: number }[]>([]);
  const [topRules, setTopRules] = useState<{ rule: string; label: string; count: number }[]>([]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [form, setForm] = useState({ hostname: "", ip_address: "", os: "Windows 10", agent_group: "default" });

  const load = useCallback(async () => {
    const [alertRes, agentRes] = await Promise.all([fetch("/api/alerts"), fetch("/api/agents")]);
    const alertData = await alertRes.json();
    const agentData = await agentRes.json();
    if (alertData.kpis) setKpis(alertData.kpis);
    if (alertData.alerts) setAlerts(alertData.alerts);
    if (alertData.chart24h) setChart24h(alertData.chart24h);
    if (alertData.topRules) setTopRules(alertData.topRules);
    if (agentData.agents) setAgents(agentData.agents);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.addEventListener("new_alert", (e) => {
      const data = JSON.parse(e.data) as LiveAlert;
      setAlerts((prev) => [data, ...prev].slice(0, 50));
      setKpis((k) => ({
        ...k,
        criticalAlerts: data.severity === "critical" ? k.criticalAlerts + 1 : k.criticalAlerts,
      }));
    });
    es.addEventListener("agent_update", (e) => {
      setAgents(JSON.parse(e.data) as AgentRow[]);
    });
    return () => es.close();
  }, []);

  async function addAgent(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowAddAgent(false);
    setForm({ hostname: "", ip_address: "", os: "Windows 10", agent_group: "default" });
    load();
  }

  const maxChart = Math.max(...chart24h.flatMap((p) => [p.critical, p.medium, p.low]), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Agents", value: kpis.totalAgents, color: "text-white" },
          { label: "Active", value: kpis.active, color: "text-emerald-400" },
          { label: "Disconnected", value: kpis.disconnected, color: "text-amber-400" },
          { label: "Critical Alerts", value: kpis.criticalAlerts, color: "text-red-400" },
          { label: "EPS", value: streamEps || kpis.eps, color: "text-cyan-400" },
        ].map((k) => (
          <div key={k.label} className="glass-card px-4 py-3">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Alerts over 24h</h3>
          <div className="flex h-32 items-end gap-0.5">
            {chart24h.map((p) => (
              <div key={p.hour} className="flex flex-1 flex-col justify-end gap-0.5" title={`${p.hour}:00`}>
                <div className="bg-red-500/70" style={{ height: `${(p.critical / maxChart) * 100}%`, minHeight: 2 }} />
                <div className="bg-amber-500/50" style={{ height: `${(p.medium / maxChart) * 80}%`, minHeight: 1 }} />
                <div className="bg-emerald-500/40" style={{ height: `${(p.low / maxChart) * 60}%`, minHeight: 1 }} />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Top alert rules</h3>
          <div className="space-y-2">
            {topRules.map((r) => (
              <div key={r.rule}>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">
                    {r.rule} — {r.label}
                  </span>
                  <span className="text-cyan-400">{r.count}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy-900">
                  <div className="h-full bg-cyan-500/60" style={{ width: `${(r.count / 847) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent alerts (live)</h3>
        </div>
        <DemoTable
          columns={["Time", "Agent", "Rule", "Description", "Severity"]}
          rows={alerts.slice(0, 15).map((a) => [
            new Date(a.created_at).toLocaleTimeString("en-GB"),
            a.hostname ?? "—",
            a.rule_id ?? "—",
            <span key={a.id} className="max-w-xs truncate text-slate-300">
              {a.description}
            </span>,
            a.severity ? <SeverityBadge key={a.id + "s"} severity={a.severity as "critical"} /> : "—",
          ])}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Agent management</h3>
          <button
            type="button"
            onClick={() => setShowAddAgent(true)}
            className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"
          >
            + Add Agent
          </button>
        </div>
        <DemoTable
          columns={["ID", "Hostname", "OS", "IP", "Status", "Last seen"]}
          rows={agents.map((a) => [
            a.agent_id,
            a.hostname,
            a.os,
            a.ip_address,
            a.status === "active" ? "🟢 Active" : a.status === "slow" ? "🟡 Slow" : "🔴 Disconnected",
            new Date(a.last_seen).toLocaleTimeString("en-GB"),
          ])}
        />
      </div>

      {showAddAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={addAgent} className="glass-card w-full max-w-md space-y-3 p-5">
            <h3 className="font-semibold text-white">Add Wazuh Agent</h3>
            <input
              required
              placeholder="Hostname"
              value={form.hostname}
              onChange={(e) => setForm({ ...form, hostname: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white"
            />
            <input
              required
              placeholder="IP Address"
              value={form.ip_address}
              onChange={(e) => setForm({ ...form, ip_address: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white"
            />
            <select
              value={form.os}
              onChange={(e) => setForm({ ...form, os: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white"
            >
              {["Windows 10", "Windows 11", "Windows Server", "Ubuntu", "CentOS", "macOS"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
                Save
              </button>
              <button type="button" onClick={() => setShowAddAgent(false)} className="text-sm text-slate-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
