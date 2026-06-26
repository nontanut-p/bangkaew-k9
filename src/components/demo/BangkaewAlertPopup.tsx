"use client";

import type { BangkaewAlertData } from "@/context/DemoStreamProvider";

export function BangkaewAlertPopup({
  alert,
  onClose,
  onApprove,
}: {
  alert: BangkaewAlertData;
  onClose: () => void;
  onApprove: () => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-[100] w-full max-w-sm animate-in slide-in-from-top-2">
      <div className="glass-card border-violet-500/40 p-4 shadow-2xl">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-violet-200">🧠 {alert.title}</p>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white">
            ✕
          </button>
        </div>
        <p className="text-sm text-white">{alert.message}</p>
        {alert.hostname && (
          <p className="mt-1 text-xs text-slate-400">
            Host: {alert.hostname}
            {alert.srcIp ? ` · IP: ${alert.srcIp}` : ""}
          </p>
        )}
        {alert.collieActions && alert.collieActions.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase text-violet-400">Collie recommends</p>
            {alert.collieActions.map((a) => (
              <p key={a} className="text-xs text-cyan-200">
                🤖 {a.replace(/_/g, " ")}
              </p>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
          >
            ✅ Approve All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
