"use client";

import Link from "next/link";
import { cn } from "@/lib/demo/cn";
import type { PackAgentId } from "@/lib/demo/pack-agents";
import { packAgents } from "@/lib/demo/pack-agents";
import {
  inboxTypeStyle,
  packReports,
  reportKindStyle,
  type BangkaewInboxItem,
  type PackReport,
} from "@/lib/demo/pack-alerts";
import { usePackDemo } from "@/lib/demo/pack-demo-store";

const BANGKAEW_HREF = "/demo/pack/bangkaew";

function ReportBubble({ report, stacked, index }: { report: PackReport; stacked?: boolean; index?: number }) {
  const style = reportKindStyle[report.kind];
  return (
    <Link href={BANGKAEW_HREF} className="block transition-transform hover:scale-[1.02]">
      <div
        className={cn(
          "agent-alert-pop relative max-w-[168px] rounded-xl border px-2.5 py-2 shadow-lg backdrop-blur-sm",
          style.bg,
          style.border,
          stacked && index !== undefined && index > 0 && "opacity-90"
        )}
      >
        <div className="flex items-start gap-1.5">
          <span className="text-sm leading-none">{style.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/90">{style.label}</p>
            <p className="truncate text-xs font-semibold text-white">{report.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-white/85">{report.message}</p>
            {report.time !== "—" && (
              <p className="mt-1 font-mono text-[9px] text-white/60">{report.time}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function InboxBubble({ item }: { item: BangkaewInboxItem }) {
  const style = inboxTypeStyle[item.type];
  return (
    <Link href={BANGKAEW_HREF} className="block transition-transform hover:scale-[1.02]">
      <div
        className={cn(
          "agent-alert-pop relative max-w-[180px] rounded-xl border px-2.5 py-2 shadow-lg backdrop-blur-sm",
          style.bg,
          style.border
        )}
      >
        <div className="flex items-start gap-1.5">
          <span className="text-sm leading-none">{style.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/80">
              {item.type === "approval" ? "Needs approval" : "Recommendation"}
            </p>
            <p className="truncate text-xs font-semibold text-white">{item.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-white/85">{item.message}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PackAgentAlertPopups({ agentId }: { agentId: PackAgentId }) {
  const { inboxItems, getReportsForAgent } = usePackDemo();

  if (agentId === "bangkaew") {
    const pending = inboxItems.filter((i) => i.type === "approval");
    const primary = pending[0] ?? inboxItems[0];
    if (!primary) return null;

    return (
      <div className="pointer-events-none absolute left-1 right-1 top-1 z-40 sm:left-2 sm:right-2 sm:top-2">
        {inboxItems.length > 0 && (
          <span className="agent-alert-badge pointer-events-auto absolute -right-0.5 -top-0.5 z-50 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white ring-2 ring-navy-950">
            {pending.length || inboxItems.length}
          </span>
        )}
        <div className="pointer-events-auto flex flex-col gap-1">
          <InboxBubble item={primary} />
          {inboxItems.slice(1).map((item, i) => (
            <div
              key={item.id}
              className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-28 group-hover:opacity-100"
              style={{ transitionDelay: `${(i + 1) * 60}ms` }}
            >
              <InboxBubble item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const reports = getReportsForAgent(agentId);
  if (reports.length === 0) return null;

  return (
    <div className="pointer-events-none absolute left-1 right-1 top-1 z-40 sm:left-2 sm:right-2 sm:top-2">
      {reports.length > 1 && (
        <span className="agent-alert-badge pointer-events-auto absolute -right-0.5 -top-0.5 z-50 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-navy-950">
          {reports.length}
        </span>
      )}
      <div className="pointer-events-auto flex flex-col gap-1">
        <ReportBubble report={reports[0]} />
        {reports.slice(1).map((report, i) => (
          <div
            key={report.id}
            className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100"
            style={{ transitionDelay: `${(i + 1) * 60}ms` }}
          >
            <ReportBubble report={report} stacked index={i + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackAlertFeed({ limit = 6 }: { limit?: number }) {
  const { inboxItems } = usePackDemo();
  const items = inboxItems.slice(0, limit);

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const style = inboxTypeStyle[item.type];
        return (
          <li key={item.id}>
            <Link
              href={BANGKAEW_HREF}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-cyan-400/20 hover:bg-white/[0.06]"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
                  style.bg.replace("/95", "/25")
                )}
              >
                {style.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.message}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-slate-600">{item.time}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PackReportPipeline({ limit = 5 }: { limit?: number }) {
  const { dynamicReports } = usePackDemo();
  const allReports = [...dynamicReports, ...packReports].slice(0, limit);

  return (
    <ul className="space-y-2">
      {allReports.map((report) => {
        const agent = packAgents.find((a) => a.id === report.fromAgent)!;
        const style = reportKindStyle[report.kind];
        return (
          <li key={report.id} className="flex items-center gap-2 text-xs">
            <span className="w-16 shrink-0 truncate font-medium text-slate-400">{agent.name}</span>
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] text-white", style.bg.replace("/90", "/30"))}>
              {report.title}
            </span>
            <span className="truncate text-slate-600">{report.time}</span>
          </li>
        );
      })}
    </ul>
  );
}
