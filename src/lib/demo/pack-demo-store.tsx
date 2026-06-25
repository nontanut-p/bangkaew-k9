"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PackAgentId, PackAgentStatus } from "./pack-agents";
import { packAgentStatus as basePackAgentStatus } from "./pack-agents";
import type { BangkaewInboxItem, PackReport } from "./pack-alerts";
import { bangkaewChatStream, bangkaewInbox, packReports } from "./pack-alerts";

export type ChatMessage =
  | { role: "system"; from: string; text: string }
  | { role: "user"; text: string }
  | { role: "assistant"; text: string };

export interface RetrieverTask {
  id: string;
  label: string;
  repo: string;
  detail: string;
  resultTitle: string;
  resultMessage: string;
  durationMs: number;
}

export const retrieverTaskCatalog: RetrieverTask[] = [
  {
    id: "baseline-web-app",
    label: "Baseline scan",
    repo: "acme/web-app",
    detail: "Semgrep + Trivy + Gitleaks full scan",
    resultTitle: "2 new findings",
    resultMessage: "SQL injection risk · missing rate limit on login",
    durationMs: 4500,
  },
  {
    id: "patch-cve-lodash",
    label: "Patch CVE-2020-8203",
    repo: "acme/api-service",
    detail: "Bump lodash → 4.17.21 and open PR",
    resultTitle: "PR-46 opened",
    resultMessage: "CVE-2020-8203 patch · CI pending",
    durationMs: 5500,
  },
  {
    id: "rescan-api",
    label: "Verify PR-43 merge",
    repo: "acme/api-service",
    detail: "Rescan after gitleaks fix merged",
    resultTitle: "Scan clean",
    resultMessage: "No exposed secrets · 1 medium finding remains",
    durationMs: 3500,
  },
];

type RetrieverPhase = "idle" | "assigned" | "working" | "done";

interface RetrieverJob {
  task: RetrieverTask;
  phase: RetrieverPhase;
  progress: number;
  startedAt: number;
}

interface PackDemoState {
  chatMessages: ChatMessage[];
  inboxItems: BangkaewInboxItem[];
  dynamicReports: PackReport[];
  retrieverJob: RetrieverJob | null;
  assignRetrieverTask: (taskId: string) => void;
  getAgentStatus: (agentId: PackAgentId) => PackAgentStatus;
  getReportsForAgent: (agentId: PackAgentId) => PackReport[];
}

const PackDemoContext = createContext<PackDemoState | null>(null);

function retrieverStatusFromJob(job: RetrieverJob | null): PackAgentStatus | null {
  if (!job) return null;

  switch (job.phase) {
    case "assigned":
      return {
        state: "waiting",
        label: "Starting",
        task: `Assigned — ${job.task.label} · ${job.task.repo}`,
        statusColor: "text-amber-400",
      };
    case "working":
      return {
        state: "working",
        label: "Working",
        task: `${job.task.label} · ${job.task.repo} (${job.progress}%)`,
        statusColor: "text-emerald-400",
      };
    case "done":
      return {
        state: "idle",
        label: "Idle",
        task: `${job.task.resultTitle} — ${job.task.repo}`,
        statusColor: "text-emerald-400",
      };
    default:
      return null;
  }
}

export function PackDemoProvider({ children }: { children: ReactNode }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [...bangkaewChatStream]);
  const [inboxItems, setInboxItems] = useState<BangkaewInboxItem[]>(() => [...bangkaewInbox]);
  const [dynamicReports, setDynamicReports] = useState<PackReport[]>([]);
  const [retrieverJob, setRetrieverJob] = useState<RetrieverJob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const assignRetrieverTask = useCallback(
    (taskId: string) => {
      const task = retrieverTaskCatalog.find((t) => t.id === taskId);
      if (!task) return;
      if (retrieverJob && (retrieverJob.phase === "assigned" || retrieverJob.phase === "working")) return;

      clearTimers();

      const now = Date.now();
      setRetrieverJob({ task, phase: "assigned", progress: 0, startedAt: now });

      setChatMessages((prev) => [
        ...prev,
        { role: "system", from: "bangkaew", text: `→ retriever: ${task.label} on ${task.repo}` },
        { role: "assistant", text: `Assigned Retriever — ${task.detail}. I'll update you when it's done.` },
      ]);

      completeTimerRef.current = setTimeout(() => {
        setRetrieverJob((job) => (job ? { ...job, phase: "working", progress: 8 } : null));

        timerRef.current = setInterval(() => {
          setRetrieverJob((job) => {
            if (!job || job.phase !== "working") return job;
            const next = Math.min(job.progress + 12, 100);
            return { ...job, progress: next };
          });
        }, 400);

        completeTimerRef.current = setTimeout(() => {
          clearTimers();

          const report: PackReport = {
            id: `R-live-${task.id}`,
            fromAgent: "retriever",
            kind: task.id.includes("patch") ? "fix_ready" : "analysis",
            title: task.resultTitle,
            message: `${task.resultMessage} · ${task.repo}`,
            time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          };

          const inbox: BangkaewInboxItem = {
            id: `B-live-${task.id}`,
            type: "recommendation",
            title: task.resultTitle,
            message: `${task.resultMessage} · ${task.repo}`,
            time: report.time,
            sources: ["retriever"],
          };

          setDynamicReports((prev) => [report, ...prev]);
          setInboxItems((prev) => [inbox, ...prev]);
          setRetrieverJob((job) => (job ? { ...job, phase: "done", progress: 100 } : null));

          setChatMessages((prev) => [
            ...prev,
            { role: "system", from: "retriever", text: `${task.resultTitle} — ${task.resultMessage}` },
            {
              role: "assistant",
              text: `Retriever finished ${task.label.toLowerCase()} on ${task.repo}. ${task.resultMessage}. Review in inbox or on Retriever's page.`,
            },
          ]);
        }, task.durationMs);
      }, 800);
    },
    [clearTimers, retrieverJob]
  );

  const getAgentStatus = useCallback(
    (agentId: PackAgentId): PackAgentStatus => {
      if (agentId === "retriever") {
        const override = retrieverStatusFromJob(retrieverJob);
        if (override) return override;
      }
      return basePackAgentStatus[agentId];
    },
    [retrieverJob]
  );

  const getReportsForAgent = useCallback(
    (agentId: PackAgentId): PackReport[] => {
      const staticReports = packReports.filter((r) => r.fromAgent === agentId);
      const live = dynamicReports.filter((r) => r.fromAgent === agentId);
      return [...live, ...staticReports];
    },
    [dynamicReports]
  );

  const value = useMemo(
    () => ({
      chatMessages,
      inboxItems,
      dynamicReports,
      retrieverJob,
      assignRetrieverTask,
      getAgentStatus,
      getReportsForAgent,
    }),
    [
      chatMessages,
      inboxItems,
      dynamicReports,
      retrieverJob,
      assignRetrieverTask,
      getAgentStatus,
      getReportsForAgent,
    ]
  );

  return <PackDemoContext.Provider value={value}>{children}</PackDemoContext.Provider>;
}

export function usePackDemo() {
  const ctx = useContext(PackDemoContext);
  if (!ctx) {
    throw new Error("usePackDemo must be used within PackDemoProvider");
  }
  return ctx;
}

export function usePackAgentStatus(agentId: PackAgentId): PackAgentStatus {
  const { getAgentStatus } = usePackDemo();
  return getAgentStatus(agentId);
}
