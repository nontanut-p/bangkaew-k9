"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePackDemo } from "@/lib/demo/pack-demo-store";
import {
  bangkaewCommandExamples,
  commandCategoryStyle,
  getCommandGroups,
} from "@/lib/demo/bangkaew-commands";
import { cn } from "@/lib/demo/cn";

export function BangkaewCommanderPanel({ compact }: { compact?: boolean }) {
  const {
    chatMessages,
    inboxItems,
    retrieverJob,
    sendBangkaewMessage,
    approveInboxItem,
  } = usePackDemo();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pending = inboxItems.filter((i) => i.type === "approval").length;
  const retrieverBusy =
    retrieverJob?.phase === "assigned" || retrieverJob?.phase === "working";
  const commandGroups = getCommandGroups();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    sendBangkaewMessage(message);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

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
              <span className="whitespace-pre-line">{msg.text}</span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {retrieverBusy && retrieverJob && (
        <div className="border-t border-white/5 px-4 py-3">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-200">
                Retriever: {retrieverJob.task.label} · {retrieverJob.task.repo}
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
        </div>
      )}

      {!compact && pending > 0 && (
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
                  <p className="w-full text-[10px] text-slate-400">{item.message}</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => approveInboxItem(item.id)}
                      className="rounded bg-violet-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-violet-400"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!compact && (
        <div className="border-t border-white/5 p-4">
          <p className="mb-2 text-xs font-semibold text-slate-400">Example commands — tap to send</p>
          <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
            {commandGroups.map((group) => (
              <div key={group.agent}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.commands.map((cmd) => (
                    <button
                      key={cmd.id}
                      type="button"
                      title={cmd.example}
                      onClick={() => handleSend(cmd.example)}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-left text-[10px] transition-colors hover:brightness-125",
                        commandCategoryStyle[cmd.category]
                      )}
                    >
                      <span className="block font-medium">{cmd.hint}</span>
                      <span className="block truncate text-[9px] opacity-70">{cmd.example}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {compact && (
        <div className="border-t border-white/5 px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {bangkaewCommandExamples.slice(0, 4).map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => handleSend(cmd.example)}
                className={cn(
                  "rounded border px-1.5 py-0.5 text-[9px] hover:brightness-125",
                  commandCategoryStyle[cmd.category]
                )}
              >
                {cmd.hint}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/5 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Order Bangkaew — e.g. Shepherd, report endpoint health"
            className="flex-1 rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
