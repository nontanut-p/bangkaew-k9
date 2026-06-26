"use client";

import { useEffect, useState } from "react";
import { isAlarmMuted, setAlarmMuted } from "@/lib/audio/alarm";
import { cn } from "@/lib/demo/cn";

export function AlarmToggle() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(isAlarmMuted());
  }, []);

  function toggle() {
    const next = !muted;
    setMuted(next);
    setAlarmMuted(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
        muted
          ? "border-white/10 text-slate-400 hover:text-white"
          : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
      )}
    >
      {muted ? "🔕 Mute" : "🔔 Sound on"}
    </button>
  );
}
