"use client";

import Image from "next/image";
import { retrieverTaskCatalog, usePackDemo } from "@/lib/demo/pack-demo-store";
import { DemoButton } from "@/components/demo/ui";
import { cn } from "@/lib/demo/cn";

export function BangkaewCommanderPanel({ compact }: { compact?: boolean }) {
  const { chatMessages, inboxItems, retrieverJob, assignRetrieverTask } = usePackDemo();
  const pending = inboxItems.filter((i) => i.type === "approval").length;
  const retrieverBusy =
    retrieverJob?.phase === "assigned" || retrieverJob?.phase === "working";

  return (
    <div className={cn("glass-card overflow-hidden border-cyan-500/25", compact ? "p-4" : "p-0")}>
      <div className="flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-teal-500/5 p-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-2 ring-cyan-400/40">
          <Image src="/pack/bangkaew.png" alt="Bangkaew" fill className="object-cover object-top" />
          <span className="agent-dot-working absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-navy-950" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">Commander</p>
          <h3 className="text-lg font-bold text-white">Agent Bangkaew</h3>
        </div>
        {pending > 0 && (
          <span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-300">
            {pending} pending
          </span>
        )}
      </div>

      <div className={cn("space-y-2 overflow-y-auto bg-navy-950/40 p-4", compact ? "max-h-48" : "max-h-72")}>
        {chatMessages.map((msg, i) => {
          if (msg.role === "system") {
            return (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 font-mono uppercase text-slate-500">
                  {msg.from}
                </span>
                <span className="rounded-lg bg-orange-500/10 px-2 py-1 text-orange-200/90">{msg.text}</span>
              </div>
            );
          }
          if (msg.role === "user") {
            return (
              <div key={i} className="ml-8 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
                {msg.text}
              </div>
            );
          }
          return (
            <div
              key={i}
              className="mr-4 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"
            >
              <span className="mb-1 block text-[10px] font-semibold uppercase text-cyan-400/80">Bangkaew</span>
              {msg.text}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="border-t border-white/5 p-4">
          <p className="mb-2 text-xs font-semibold text-emerald-300">Assign Retriever</p>
          {retrieverBusy && retrieverJob ? (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-200">
                  {retrieverJob.task.label} · {retrieverJob.task.repo}
                </span>
                <span className="font-mono text-emerald-400">{retrieverJob.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-900">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${retrieverJob.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {retrieverTaskCatalog.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => assignRetrieverTask(task.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-left transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white">{task.label}</p>
                    <p className="truncate text-[10px] text-slate-400">
                      {task.repo} · {task.detail}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-emerald-400">Assign →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!compact && inboxItems.filter((i) => i.type === "approval").length > 0 && (
        <div className="border-t border-white/5 p-4">
          <p className="mb-2 text-xs font-semibold text-violet-300">Pending approval</p>
          <div className="space-y-2">
            {inboxItems
              .filter((i) => i.type === "approval")
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2"
                >
                  <p className="text-xs text-white">{item.title}</p>
                  <div className="flex gap-1">
                    <button type="button" className="rounded bg-violet-500 px-2 py-0.5 text-[10px] font-medium text-white">
                      Approve
                    </button>
                    <button type="button" className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-slate-400">
                      Deny
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/5 p-4">
        <div className="flex gap-2">
          <input
            readOnly
            placeholder="Ask Bangkaew anything..."
            className="flex-1 rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-slate-400"
          />
          <DemoButton href="/demo/pack/bangkaew">Send</DemoButton>
        </div>
      </div>
    </div>
  );
}
