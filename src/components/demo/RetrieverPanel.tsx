"use client";

import { useState } from "react";
import {
  aiProviderOptions,
  getAiProvider,
  isValidRepoName,
  normalizeRepoName,
  repoStackOptions,
  type RepoStack,
} from "@/lib/demo/retriever-config";
import {
  owaspCoverageSummary,
  owaspTop10,
  retrieverScanStack,
} from "@/lib/demo/retriever-owasp";
import { findings, pullRequests } from "@/lib/demo/mock-data";
import { usePackDemo } from "@/lib/demo/pack-demo-store";
import { DemoButton, DemoTable, SeverityBadge, StatusBadge } from "@/components/demo/ui";
import { cn } from "@/lib/demo/cn";

const BANGKAEW_HREF = "/demo/pack/bangkaew";

export function RetrieverPanel() {
  const {
    retrieverJob,
    retrieverRepos,
    aiProviderId,
    addRetrieverRepo,
    removeRetrieverRepo,
    setAiProvider,
  } = usePackDemo();

  const [repoInput, setRepoInput] = useState("");
  const [stackInput, setStackInput] = useState<RepoStack>("Node.js");
  const [repoError, setRepoError] = useState("");

  const retrieverBusy =
    retrieverJob?.phase === "assigned" || retrieverJob?.phase === "working";
  const activeProvider = getAiProvider(aiProviderId);
  const owaspSummary = owaspCoverageSummary();

  const repoNames = new Set(retrieverRepos.map((r) => r.name));
  const visiblePrs = pullRequests.filter((p) => repoNames.has(p.repo));
  const visibleFindings = findings.slice(0, 6);

  function handleAddRepo(e: React.FormEvent) {
    e.preventDefault();
    const name = normalizeRepoName(repoInput);
    if (!isValidRepoName(name)) {
      setRepoError("Use format: org/repo (e.g. acme/web-app)");
      return;
    }
    if (retrieverRepos.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      setRepoError("Repository already linked");
      return;
    }
    const added = addRetrieverRepo(name, stackInput);
    if (added) {
      setRepoInput("");
      setRepoError("");
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">
        Link GitHub repos, choose an AI provider for auto-fix PRs, and baseline-scan with Semgrep, Trivy,
        Gitleaks — mapped to OWASP Top 10.
      </p>

      <div className="flex flex-wrap gap-2">
        {retrieverScanStack.map((tool) => (
          <span
            key={tool}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] font-medium",
              tool === "OWASP Top 10"
                ? "border-orange-500/30 bg-orange-500/10 text-orange-200"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            )}
          >
            {tool}
          </span>
        ))}
      </div>

      {retrieverJob && retrieverJob.phase !== "idle" && (
        <div className="glass-card border-emerald-500/25 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-emerald-200">
              {retrieverJob.phase === "done" ? "Completed" : "Current task"}
            </p>
            {retrieverJob.phase === "working" && (
              <span className="font-mono text-xs text-emerald-400">{retrieverJob.progress}%</span>
            )}
          </div>
          <p className="mt-1 text-sm text-white">
            {retrieverJob.task.label} · {retrieverJob.task.repo}
          </p>
          <p className="text-xs text-slate-400">{retrieverJob.task.detail}</p>
          {(retrieverJob.phase === "working" || retrieverJob.phase === "assigned") && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-900">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.max(retrieverJob.progress, 5)}%` }}
              />
            </div>
          )}
          {retrieverJob.phase === "done" && (
            <p className="mt-2 text-xs text-emerald-300">
              {retrieverJob.task.resultTitle} — {retrieverJob.task.resultMessage}
            </p>
          )}
        </div>
      )}

      {!retrieverBusy && (
        <div className="glass-card border-cyan-500/20 p-4">
          <p className="mb-3 text-sm text-slate-300">Retriever is idle — assign a scan from Bangkaew</p>
          <DemoButton href={BANGKAEW_HREF}>Go to Bangkaew chat</DemoButton>
        </div>
      )}

      {/* OWASP Top 10 */}
      <div className="glass-card p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">OWASP Top 10 (2021) coverage</h3>
            <p className="text-xs text-slate-500">
              {owaspSummary.coverageLabel} · {owaspSummary.totalFindings} findings mapped across linked repos
            </p>
          </div>
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-200">
            OWASP
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {owaspTop10.map((cat) => (
            <div
              key={cat.id}
              className={cn(
                "rounded-lg border px-2.5 py-2",
                cat.status === "critical"
                  ? "border-red-500/30 bg-red-500/5"
                  : cat.status === "warn"
                    ? "border-amber-500/20 bg-amber-500/5"
                    : "border-white/5 bg-white/[0.02]"
              )}
            >
              <p className="font-mono text-[10px] text-orange-400/90">{cat.rank}</p>
              <p className="text-[11px] font-medium leading-tight text-white">{cat.name}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {cat.findings === 0 ? "Clean" : `${cat.findings} finding${cat.findings > 1 ? "s" : ""}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub repos */}
      <div className="glass-card p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">GitHub repositories</h3>
            <p className="text-xs text-slate-500">
              {retrieverRepos.length} linked · baseline scan on assignment
            </p>
          </div>
          <StatusBadge status="Connected" />
        </div>

        <form onSubmit={handleAddRepo} className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <input
              type="text"
              value={repoInput}
              onChange={(e) => {
                setRepoInput(e.target.value);
                setRepoError("");
              }}
              placeholder="org/repo or https://github.com/org/repo"
              className="w-full rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-slate-600"
            />
            {repoError && <p className="mt-1 text-xs text-red-400">{repoError}</p>}
          </div>
          <select
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value as RepoStack)}
            className="rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white"
          >
            {repoStackOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Add repo
          </button>
        </form>

        {retrieverRepos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 py-8 text-center text-sm text-slate-500">
            No repositories linked. Add a GitHub repo to start scanning.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-slate-500">
                  <th className="pb-2 pr-4 font-medium">Repository</th>
                  <th className="pb-2 pr-4 font-medium">Stack</th>
                  <th className="pb-2 pr-4 font-medium">Findings</th>
                  <th className="pb-2 pr-4 font-medium">Open PRs</th>
                  <th className="pb-2 pr-4 font-medium">Last scan</th>
                  <th className="pb-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {retrieverRepos.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-emerald-300">{r.name}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{r.stack}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{r.openFindings}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{r.openPrs}</td>
                    <td className="py-2.5 pr-4 text-xs text-slate-500">{r.lastScan}</td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeRetrieverRepo(r.id)}
                        className="rounded border border-red-500/30 px-2 py-0.5 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI provider */}
      <div className="glass-card p-4">
        <h3 className="mb-1 text-sm font-semibold text-white">AI provider for code fixes</h3>
        <p className="mb-4 text-xs text-slate-500">
          Retriever uses the selected model to generate patches and open PRs — never pushes directly to main.
        </p>

        {activeProvider && (
          <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <p className="text-xs font-medium text-emerald-300">
              Active: {activeProvider.icon} {activeProvider.name} · {activeProvider.model}
            </p>
            <p className="text-[11px] text-slate-400">{activeProvider.description}</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aiProviderOptions.map((provider) => {
            const selected = aiProviderId === provider.id;
            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => setAiProvider(provider.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  selected
                    ? "border-emerald-500/40 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-white/5 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04]"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{provider.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{provider.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {provider.vendor} · {provider.model}
                    </p>
                  </div>
                </div>
                <p className="mb-2 text-[11px] text-slate-400">{provider.description}</p>
                <div className="flex flex-wrap gap-1">
                  {provider.strengths.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/5 px-1.5 py-0.5 text-[9px] text-slate-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {selected && (
                  <p className="mt-2 text-[10px] font-semibold uppercase text-emerald-400">Selected</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Top findings</h3>
        <DemoTable
          columns={["Finding", "OWASP", "Severity", "Tool", "Auto Fix"]}
          rows={visibleFindings.map((f) => [
            f.title,
            <span key={f.id + "o"} className="font-mono text-[10px] text-orange-300/90">
              {f.owasp}
            </span>,
            <SeverityBadge key={f.id} severity={f.severity} />,
            f.tool,
            f.autoFix ? "✓ Yes" : "—",
          ])}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Auto-fix pull requests</h3>
        {visiblePrs.length === 0 ? (
          <p className="text-sm text-slate-500">No PRs for linked repositories.</p>
        ) : (
          <DemoTable
            columns={["PR", "Repo", "Status", "CI"]}
            rows={visiblePrs.map((p) => [
              p.title,
              p.repo,
              <StatusBadge key={p.id} status={p.status} />,
              p.ciStatus,
            ])}
          />
        )}
      </div>
    </div>
  );
}
