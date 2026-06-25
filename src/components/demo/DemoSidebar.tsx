"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { packAgents, packAgentStateMeta, type PackAgent } from "@/lib/demo/pack-agents";
import { usePackAgentStatus } from "@/lib/demo/pack-demo-store";
import { PackAgentAvatar } from "@/components/demo/PackAgentStatus";
import { cn } from "@/lib/demo/cn";

function SidebarAgentItem({
  agent,
  active,
  onNavigate,
}: {
  agent: PackAgent;
  active: boolean;
  onNavigate: () => void;
}) {
  const st = usePackAgentStatus(agent.id);
  const dot = packAgentStateMeta[st.state].dotClass;

  return (
    <li>
      <Link
        href={agent.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors",
          active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <PackAgentAvatar agent={agent} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{agent.name}</p>
          <p className="truncate text-xs text-slate-500">{st.label}</p>
        </div>
        <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} aria-hidden />
      </Link>
    </li>
  );
}

export function DemoSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/demo";
  const activeAgent = packAgents.find((a) => pathname.startsWith(a.href));
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg border border-white/10 bg-navy-900 p-2 text-white lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-56 transform border-r border-white/5 bg-navy-950 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/5 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
              K9
            </div>
            <span className="font-bold text-white">
              Bangkaew <span className="text-cyan-400">K9</span>
            </span>
          </Link>
        </div>

        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
          <Link
            href="/demo"
            onClick={close}
            className={cn(
              "mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isHome ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <span>🏠</span> Pack HQ
          </Link>

          <Link
            href="/demo/pack/bangkaew"
            onClick={close}
            className={cn(
              "mb-3 flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/demo/pack/bangkaew")
                ? "text-cyan-200"
                : "text-cyan-400 hover:bg-cyan-500/15"
            )}
          >
            <span>💬</span> Chat with Bangkaew
          </Link>

          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-slate-600">
            🐕 The Pack
          </p>
          <ul className="space-y-1">
            {packAgents.map((agent) => (
              <SidebarAgentItem
                key={agent.id}
                agent={agent}
                active={activeAgent?.id === agent.id}
                onNavigate={close}
              />
            ))}
          </ul>

          <div className="mt-6 border-t border-white/5 pt-4">
            <Link
              href="/demo/setup"
              onClick={close}
              className={cn(
                "block rounded-lg px-3 py-2 text-xs text-slate-500 transition-colors hover:text-slate-300",
                pathname === "/demo/setup" && "text-cyan-400"
              )}
            >
              ⚙️ Setup & integrations
            </Link>
          </div>
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={close}
          aria-hidden
        />
      )}
    </>
  );
}
