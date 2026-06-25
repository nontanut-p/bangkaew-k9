import Link from "next/link";
import { cn } from "@/lib/demo/cn";

export function SeverityBadge({
  severity,
}: {
  severity: "low" | "medium" | "high" | "critical" | string;
}) {
  const colors: Record<string, string> = {
    low: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    high: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    critical: "bg-red-500/10 text-red-300 border-red-500/30",
    Low: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    Medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    High: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    Critical: "bg-red-500/10 text-red-300 border-red-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        colors[severity] ?? "border-white/10 text-slate-400"
      )}
    >
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const ok = ["Online", "Connected", "Success", "Passing", "Enabled", "Merged", "Verified", "Resolved", "Updated"];
  const warn = ["Warning", "Pending", "Running", "Investigating", "Waiting Approval", "Open", "In Progress"];
  const bad = ["Offline", "Failed", "Error", "Critical", "Not Configured", "Disabled"];
  let cls = "border-white/10 text-slate-400 bg-white/5";
  if (ok.some((s) => status.includes(s))) cls = "border-emerald-500/30 text-emerald-300 bg-emerald-500/10";
  else if (warn.some((s) => status.includes(s))) cls = "border-amber-500/30 text-amber-300 bg-amber-500/10";
  else if (bad.some((s) => status.includes(s))) cls = "border-red-500/30 text-red-300 bg-red-500/10";
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", cls)}>
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <div className="glass-card p-4 transition-colors hover:border-cyan-400/20">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function DemoPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DemoTable({
  columns,
  rows,
  onRowClick,
}: {
  columns: string[];
  rows: (string | React.ReactNode)[][];
  onRowClick?: (index: number) => void;
}) {
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-white/5 text-slate-300 last:border-0",
                onRowClick && "cursor-pointer hover:bg-white/[0.03]"
              )}
              onClick={() => onRowClick?.(i)}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DemoButton({
  children,
  variant = "primary",
  onClick,
  href,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  href?: string;
}) {
  const cls = cn(
    "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
    variant === "primary" && "bg-cyan-500 text-white hover:bg-cyan-400",
    variant === "secondary" && "border border-white/10 text-slate-300 hover:border-cyan-400/30",
    variant === "ghost" && "text-slate-400 hover:text-cyan-400"
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs text-cyan-300">
      🐕 Demo Mode — Dummy data for exploration. Ready to connect to real backend via API.
      {children}
    </div>
  );
}
