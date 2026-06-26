"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { playAlarm } from "@/lib/audio/alarm";
import { BangkaewAlertPopup } from "@/components/demo/BangkaewAlertPopup";

export interface BangkaewAlertData {
  title: string;
  message: string;
  severity?: string;
  hostname?: string;
  srcIp?: string;
  collieActions?: string[];
}

interface DemoStreamState {
  alerts: Record<string, unknown>[];
  eps: number;
  pushAlert: (a: Record<string, unknown>) => void;
}

const DemoStreamContext = createContext<DemoStreamState | null>(null);

export function DemoStreamProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Record<string, unknown>[]>([]);
  const [eps, setEps] = useState(847);
  const [popup, setPopup] = useState<BangkaewAlertData | null>(null);

  const pushAlert = useCallback((a: Record<string, unknown>) => {
    setAlerts((prev) => [a, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/stream");

    es.addEventListener("new_alert", (e) => {
      const data = JSON.parse(e.data) as Record<string, unknown>;
      pushAlert(data);
      if (data.severity === "critical") playAlarm("critical");
      else if (data.severity === "high") playAlarm("warning");
    });

    es.addEventListener("eps_update", (e) => {
      const data = JSON.parse(e.data) as { eps: number };
      setEps(data.eps);
    });

    es.addEventListener("bangkaew_alert", (e) => {
      const data = JSON.parse(e.data) as BangkaewAlertData;
      setPopup(data);
      playAlarm("warning");
    });

    es.addEventListener("collie_action", () => {
      playAlarm("notification");
    });

    es.addEventListener("attack_progress", (e) => {
      const data = JSON.parse(e.data) as { status?: string };
      if (data.status === "started") playAlarm("critical");
    });

    return () => es.close();
  }, [pushAlert]);

  return (
    <DemoStreamContext.Provider value={{ alerts, eps, pushAlert }}>
      {children}
      {popup && (
        <BangkaewAlertPopup
          alert={popup}
          onClose={() => setPopup(null)}
          onApprove={async () => {
            await fetch("/api/collie/actions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ actionId: 1, approve: true }),
            });
            playAlarm("notification");
            setPopup(null);
          }}
        />
      )}
    </DemoStreamContext.Provider>
  );
}

export function useDemoStream() {
  const ctx = useContext(DemoStreamContext);
  if (!ctx) throw new Error("useDemoStream must be used within DemoStreamProvider");
  return ctx;
}
