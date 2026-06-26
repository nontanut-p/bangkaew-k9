"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/demo/cn";

const MODULES = [
  { key: "wazuh", name: "Wazuh SIEM", icon: "🛡️", desc: "Detect threats, ingest endpoint logs" },
  { key: "pitbull", name: "Pitbull Red Team", icon: "🔴", desc: "MITRE ATT&CK attack simulation" },
  { key: "retriever", name: "Retriever Code Sec", icon: "🔍", desc: "Scan GitHub repos + auto-fix" },
  { key: "collie", name: "Collie Automation", icon: "🤖", desc: "SOAR playbooks for response" },
  { key: "bangkaew", name: "Bangkaew AI Brain", icon: "🧠", desc: "AI incident analysis + reports" },
];

const MODULE_CONFIG: Record<string, { fields: { key: string; label: string; type?: string }[] }> = {
  wazuh: {
    fields: [
      { key: "url", label: "Wazuh Server URL" },
      { key: "username", label: "API Username" },
      { key: "password", label: "API Password", type: "password" },
    ],
  },
  pitbull: {
    fields: [
      { key: "url", label: "Caldera Server URL" },
      { key: "apiKey", label: "API Key", type: "password" },
    ],
  },
  retriever: {
    fields: [
      { key: "githubToken", label: "GitHub PAT", type: "password" },
      { key: "repo", label: "Default repository" },
      { key: "branch", label: "Branch" },
    ],
  },
  collie: {
    fields: [
      { key: "url", label: "Shuffle URL" },
      { key: "apiKey", label: "API Key", type: "password" },
      { key: "workflow", label: "Default workflow" },
    ],
  },
  bangkaew: {
    fields: [
      { key: "provider", label: "LLM Provider (claude/openai/ollama/deepseek)" },
      { key: "apiKey", label: "API Key", type: "password" },
      { key: "endpoint", label: "Endpoint URL (optional)" },
    ],
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(["wazuh", "pitbull", "retriever", "collie", "bangkaew"]);
  const [configIdx, setConfigIdx] = useState(0);
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [testOk, setTestOk] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.onboardingComplete) router.replace("/demo");
      });
  }, [router]);

  function toggleModule(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function saveModules() {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleKeys: selected, step: 1 }),
    });
    setStep(1);
    setConfigIdx(0);
  }

  async function saveModuleConfig() {
    const key = selected[configIdx];
    const cfg = configs[key] ?? {};
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleKey: key, config: cfg, step: configIdx + 2 }),
    });
    if (configIdx + 1 >= selected.length) {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finish: true }),
      });
      router.push("/demo");
    } else {
      setConfigIdx(configIdx + 1);
      setTestOk(false);
    }
  }

  function testConnection() {
    setTestOk(true);
  }

  const currentModule = selected[configIdx];
  const fields = currentModule ? MODULE_CONFIG[currentModule]?.fields ?? [] : [];

  return (
    <div className="min-h-screen bg-navy-950 p-6 pt-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-white">Setup Wizard</h1>
        <p className="mb-6 text-sm text-slate-400">
          Step {step === 0 ? 1 : configIdx + 2} — Configure your Bangkaew K9 demo
        </p>

        {step === 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {MODULES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleModule(m.key)}
                  className={cn(
                    "glass-card p-4 text-left transition-colors",
                    selected.includes(m.key) ? "border-cyan-500/40 ring-1 ring-cyan-500/30" : "opacity-70"
                  )}
                >
                  <p className="text-lg">
                    {m.icon} {m.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{m.desc}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={saveModules}
              disabled={selected.length === 0}
              className="mt-6 rounded-lg bg-cyan-600 px-6 py-2.5 text-white disabled:opacity-40"
            >
              Next →
            </button>
          </>
        )}

        {step === 1 && currentModule && (
          <div className="glass-card space-y-4 p-6">
            <h2 className="text-lg font-semibold text-white">
              {MODULES.find((m) => m.key === currentModule)?.icon}{" "}
              {MODULES.find((m) => m.key === currentModule)?.name} setup
            </h2>
            {fields.map((f) => (
              <label key={f.key} className="block">
                <span className="text-xs text-slate-400">{f.label}</span>
                <input
                  type={f.type ?? "text"}
                  value={configs[currentModule]?.[f.key] ?? ""}
                  onChange={(e) =>
                    setConfigs({
                      ...configs,
                      [currentModule]: { ...configs[currentModule], [f.key]: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-white"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={testConnection}
              className="rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-300"
            >
              Test connection
            </button>
            {testOk && <p className="text-sm text-emerald-400">✅ Connected successfully (mock)</p>}
            <button
              type="button"
              onClick={saveModuleConfig}
              className="rounded-lg bg-cyan-600 px-6 py-2.5 text-white"
            >
              {configIdx + 1 >= selected.length ? "Finish setup" : "Next module →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
