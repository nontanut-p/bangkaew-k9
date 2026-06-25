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
import { collieActionCatalog, type CollieActionTemplate } from "./collie-shuffle";
import { repositories as initialRepositories } from "./mock-data";
import type { Repository } from "./types";
import { createRepository, getAiProvider, type RepoStack } from "./retriever-config";
import { resolveBangkaewCommand } from "./bangkaew-commands";
import { executiveDashboard, incidents } from "./mock-data";
import { packAgents } from "./pack-agents";

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

type ColliePhase = "awaiting_approval" | "executing" | "done";

interface CollieJob {
  action: CollieActionTemplate;
  phase: ColliePhase;
  progress: number;
  inboxId: string;
}

interface ShepherdJob {
  label: string;
  phase: "working" | "done";
  progress: number;
}

interface PackDemoState {
  chatMessages: ChatMessage[];
  inboxItems: BangkaewInboxItem[];
  dynamicReports: PackReport[];
  retrieverJob: RetrieverJob | null;
  collieJob: CollieJob | null;
  shepherdJob: ShepherdJob | null;
  pendingCollieActions: string[];
  retrieverRepos: Repository[];
  aiProviderId: string;
  assignRetrieverTask: (taskId: string) => void;
  requestCollieAction: (actionId: string) => void;
  approveInboxItem: (inboxId: string) => void;
  addRetrieverRepo: (name: string, stack: RepoStack) => boolean;
  removeRetrieverRepo: (id: string) => void;
  setAiProvider: (providerId: string) => void;
  sendBangkaewMessage: (text: string) => void;
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

function collieStatusFromJob(job: CollieJob | null): PackAgentStatus | null {
  if (!job) return null;

  switch (job.phase) {
    case "awaiting_approval":
      return {
        state: "waiting",
        label: "Awaiting approval",
        task: `${job.action.label} · ${job.action.target} → Bangkaew`,
        statusColor: "text-amber-400",
      };
    case "executing":
      return {
        state: "working",
        label: "Working",
        task: `${job.action.playbook} · ${job.action.target} (${job.progress}%)`,
        statusColor: "text-violet-400",
      };
    case "done":
      return {
        state: "idle",
        label: "Idle",
        task: `${job.action.playbook} complete — ${job.action.target}`,
        statusColor: "text-violet-400",
      };
    default:
      return null;
  }
}

function shepherdStatusFromJob(job: ShepherdJob | null): PackAgentStatus | null {
  if (!job) return null;
  if (job.phase === "working") {
    return {
      state: "working",
      label: "Working",
      task: `${job.label} (${job.progress}%)`,
      statusColor: "text-blue-400",
    };
  }
  return {
    state: "idle",
    label: "Idle",
    task: job.label,
    statusColor: "text-blue-400",
  };
}

const INBOX_COLLIE_ACTION: Record<string, string> = {
  "B-01": "block-ip",
  "B-02": "isolate-host",
};

export function PackDemoProvider({ children }: { children: ReactNode }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [...bangkaewChatStream]);
  const [inboxItems, setInboxItems] = useState<BangkaewInboxItem[]>(() => [...bangkaewInbox]);
  const [dynamicReports, setDynamicReports] = useState<PackReport[]>([]);
  const [retrieverJob, setRetrieverJob] = useState<RetrieverJob | null>(null);
  const [collieJob, setCollieJob] = useState<CollieJob | null>(null);
  const [pendingCollieActions, setPendingCollieActions] = useState<string[]>([]);
  const [retrieverRepos, setRetrieverRepos] = useState<Repository[]>(() => [...initialRepositories]);
  const [aiProviderId, setAiProviderId] = useState("claude");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collieTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const collieCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shepherdJob, setShepherdJob] = useState<ShepherdJob | null>(null);
  const shepherdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const clearCollieTimers = useCallback(() => {
    if (collieTimerRef.current) {
      clearInterval(collieTimerRef.current);
      collieTimerRef.current = null;
    }
    if (collieCompleteTimerRef.current) {
      clearTimeout(collieCompleteTimerRef.current);
      collieCompleteTimerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      clearCollieTimers();
      if (shepherdTimerRef.current) {
        clearTimeout(shepherdTimerRef.current);
        shepherdTimerRef.current = null;
      }
    },
    [clearTimers, clearCollieTimers]
  );

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
        {
          role: "assistant",
          text: `Assigned Retriever — ${task.detail}. Using ${getAiProvider(aiProviderId)?.name ?? "AI"} for fixes. I'll update you when it's done.`,
        },
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
    [clearTimers, retrieverJob, aiProviderId]
  );

  const executeCollieAction = useCallback(
    (action: CollieActionTemplate, inboxId: string) => {
      clearCollieTimers();
      setCollieJob({ action, phase: "executing", progress: 5, inboxId });

      collieTimerRef.current = setInterval(() => {
        setCollieJob((job) => {
          if (!job || job.phase !== "executing") return job;
          return { ...job, progress: Math.min(job.progress + 10, 100) };
        });
      }, 350);

      collieCompleteTimerRef.current = setTimeout(() => {
        clearCollieTimers();
        const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

        const report: PackReport = {
          id: `R-collie-done-${action.id}-${Date.now()}`,
          fromAgent: "collie",
          kind: "execute_ready",
          title: `${action.playbook} complete`,
          message: `${action.resultMessage} · ${action.target}`,
          time,
        };

        setDynamicReports((prev) => [report, ...prev]);
        setCollieJob((job) => (job ? { ...job, phase: "done", progress: 100 } : null));
        setPendingCollieActions((prev) => prev.filter((id) => id !== action.id));

        setChatMessages((prev) => [
          ...prev,
          { role: "system", from: "collie", text: `${action.playbook} executed — ${action.resultMessage}` },
          {
            role: "assistant",
            text: `Approved and executed: ${action.label} on ${action.target}. ${action.resultMessage}.`,
          },
        ]);
      }, action.durationMs);
    },
    [clearCollieTimers]
  );

  const queueCollieAction = useCallback(
    (actionId: string, source: "collie" | "bangkaew") => {
      const action = collieActionCatalog.find((a) => a.id === actionId);
      if (!action) return;
      if (pendingCollieActions.includes(actionId)) return;
      if (collieJob?.phase === "executing" && collieJob.action.id === actionId) return;

      const inboxId = `B-collie-${actionId}`;
      const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

      const inbox: BangkaewInboxItem = {
        id: inboxId,
        type: "approval",
        title: `Approve ${action.label}?`,
        message: `${action.detail} · ${action.target}${action.incident ? ` · ${action.incident}` : ""}`,
        time,
        sources: source === "bangkaew" ? ["bangkaew", "collie"] : ["collie"],
        incidentId: action.incident,
      };

      const report: PackReport = {
        id: `R-collie-req-${actionId}`,
        fromAgent: "collie",
        kind: "execute_ready",
        title: `${action.label} — approval needed`,
        message: `${action.target} · queued for Bangkaew`,
        time,
      };

      setInboxItems((prev) => {
        if (prev.some((i) => i.id === inboxId)) return prev;
        return [inbox, ...prev];
      });
      setDynamicReports((prev) => [report, ...prev]);
      setPendingCollieActions((prev) => [...prev, actionId]);
      setCollieJob({ action, phase: "awaiting_approval", progress: 0, inboxId });

      if (source === "bangkaew") {
        setChatMessages((prev) => [
          ...prev,
          { role: "system", from: "bangkaew", text: `→ collie: ${action.label} · ${action.target}` },
          {
            role: "assistant",
            text: `Queued "${action.playbook}" on ${action.target} (${action.impact} impact). Approve here or type "Approve ${action.label.toLowerCase()}".`,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "system",
            from: "collie",
            text: `→ bangkaew: request ${action.label} on ${action.target}`,
          },
          {
            role: "assistant",
            text: `Collie wants to run "${action.playbook}" (${action.impact} impact). Review and approve before anything executes.`,
          },
        ]);
      }
    },
    [collieJob, pendingCollieActions]
  );

  const requestCollieAction = useCallback(
    (actionId: string) => {
      queueCollieAction(actionId, "collie");
    },
    [queueCollieAction]
  );

  const runShepherdTask = useCallback(
    (
      label: string,
      systemText: string,
      assistantText: string,
      reportTitle: string,
      reportMessage: string
    ) => {
      if (shepherdTimerRef.current) {
        clearTimeout(shepherdTimerRef.current);
        shepherdTimerRef.current = null;
      }

      setShepherdJob({ label, phase: "working", progress: 15 });

      shepherdTimerRef.current = setTimeout(() => {
        const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const report: PackReport = {
          id: `R-shepherd-${Date.now()}`,
          fromAgent: "shepherd",
          kind: "status",
          title: reportTitle,
          message: reportMessage,
          time,
        };

        setDynamicReports((prev) => [report, ...prev]);
        setShepherdJob({ label: reportTitle, phase: "done", progress: 100 });
        setChatMessages((prev) => [
          ...prev,
          { role: "system", from: "shepherd", text: systemText },
          { role: "assistant", text: assistantText },
        ]);
      }, 2800);
    },
    []
  );

  const approveInboxItem = useCallback(
    (inboxId: string) => {
      const item = inboxItems.find((i) => i.id === inboxId);
      if (!item || item.type !== "approval") return;

      setInboxItems((prev) => prev.filter((i) => i.id !== inboxId));

      const actionId = INBOX_COLLIE_ACTION[inboxId] ?? inboxId.replace("B-collie-", "");
      const action = collieActionCatalog.find((a) => a.id === actionId);
      if (!action) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: `Approved: ${item.title.replace("Approve ", "").replace("?", "")}. Collie will proceed.` },
        ]);
        return;
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "user", text: `Approved: ${action.label}` },
        { role: "assistant", text: `Approved. Collie is executing ${action.playbook} on ${action.target}.` },
      ]);

      executeCollieAction(action, inboxId);
    },
    [inboxItems, executeCollieAction]
  );

  const addRetrieverRepo = useCallback((name: string, stack: RepoStack) => {
    const repo = createRepository(name, stack);
    let added = false;
    setRetrieverRepos((prev) => {
      if (prev.some((r) => r.name.toLowerCase() === repo.name.toLowerCase())) return prev;
      added = true;
      return [...prev, repo];
    });
    if (added) {
      setChatMessages((prev) => [
        ...prev,
        { role: "system", from: "retriever", text: `GitHub repo linked: ${repo.name} (${stack})` },
        {
          role: "assistant",
          text: `Added ${repo.name}. Retriever will baseline-scan with Semgrep, Trivy, Gitleaks, and OWASP Top 10 mapping on next assignment.`,
        },
      ]);
    }
    return added;
  }, []);

  const removeRetrieverRepo = useCallback((id: string) => {
    setRetrieverRepos((prev) => {
      const target = prev.find((r) => r.id === id);
      if (!target) return prev;
      setChatMessages((msgs) => [
        ...msgs,
        { role: "system", from: "retriever", text: `GitHub repo unlinked: ${target.name}` },
        { role: "assistant", text: `Removed ${target.name} from Retriever scan scope.` },
      ]);
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const setAiProvider = useCallback((providerId: string) => {
    const provider = getAiProvider(providerId);
    if (!provider) return;
    setAiProviderId(providerId);
    setChatMessages((prev) => [
      ...prev,
      {
        role: "system",
        from: "retriever",
        text: `AI provider → ${provider.name} (${provider.model})`,
      },
      {
        role: "assistant",
        text: `Retriever will generate fix PRs using ${provider.name}. ${provider.description}`,
      },
    ]);
  }, []);

  const sendBangkaewMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setChatMessages((prev) => [...prev, { role: "user", text: trimmed }]);

      const cmd = resolveBangkaewCommand(trimmed);
      if (!cmd) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "I didn't recognize that command. Tap an example below or type something similar — e.g. \"Shepherd, report endpoint health\" or \"Retriever, scan acme/web-app\".",
          },
        ]);
        return;
      }

      switch (cmd.action) {
        case "status-score":
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `Security score: ${executiveDashboard.securityScore}/100 (${executiveDashboard.riskLevel} risk). ${executiveDashboard.openVulnerabilities} open vulnerabilities across ${executiveDashboard.protectedEndpoints} endpoints. MTTD ${executiveDashboard.mttd} · MTTR ${executiveDashboard.mttr}.`,
            },
          ]);
          break;

        case "status-incidents": {
          const open = incidents.filter((i) => i.status !== "Resolved");
          const summary = open.length
            ? open.map((i) => `${i.id} (${i.severity}): ${i.title} — ${i.status}`).join("\n")
            : "No open incidents.";
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `${open.length} open incident${open.length === 1 ? "" : "s"}:\n${summary}`,
            },
          ]);
          break;
        }

        case "status-pack": {
          const packLines = (["shepherd", "retriever", "collie", "pitbull"] as PackAgentId[]).map(
            (id) => {
              const agent = packAgents.find((a) => a.id === id);
              let status = basePackAgentStatus[id];
              if (id === "retriever") status = retrieverStatusFromJob(retrieverJob) ?? status;
              if (id === "collie") status = collieStatusFromJob(collieJob) ?? status;
              if (id === "shepherd") status = shepherdStatusFromJob(shepherdJob) ?? status;
              return `• ${agent?.name ?? id}: ${status.label} — ${status.task}`;
            }
          );
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", text: `Pack status:\n${packLines.join("\n")}` },
          ]);
          break;
        }

        case "shepherd-endpoints":
          runShepherdTask(
            "Endpoint health scan",
            "10 agents online · 2 critical · 1 outdated agent",
            "Shepherd reports 10/10 endpoints online. 2 critical alerts on it-laptop-02 and srv-prod-02. Agent v4.7.0 on srv-dev-01 is outdated.",
            "Endpoint health",
            "10 online · 2 critical · 1 agent update needed"
          );
          break;

        case "shepherd-alerts":
          runShepherdTask(
            "Critical alert digest",
            "4 alerts today · 1 critical · 2 high · 1 medium",
            "Today's critical: ALT-898 brute force on exec-pc-01 (resolved). Active high: ALT-901 PowerShell on it-laptop-02 linked to INC-2026-041.",
            "Alert digest",
            "4 alerts · 1 critical · 2 high"
          );
          break;

        case "shepherd-compliance":
          runShepherdTask(
            "Compliance posture",
            "SCA 87% pass · CIS L1 82% · OWASP mapping attached",
            "Shepherd SCA: 87% pass (3 failed checks on srv-prod-01). CIS Level 1: 82%. OWASP Top 10 coverage mapped for web endpoints.",
            "Compliance report",
            "SCA 87% · CIS 82% · OWASP mapped"
          );
          break;

        case "retriever-baseline-web-app":
          assignRetrieverTask("baseline-web-app");
          break;

        case "retriever-patch-cve-lodash":
          assignRetrieverTask("patch-cve-lodash");
          break;

        case "retriever-rescan-api":
          assignRetrieverTask("rescan-api");
          break;

        case "retriever-ai-claude":
          setAiProvider("claude");
          break;

        case "retriever-ai-deepseek":
          setAiProvider("deepseek");
          break;

        case "retriever-ai-glm":
          setAiProvider("glm");
          break;

        case "collie-block-ip":
          queueCollieAction("block-ip", "bangkaew");
          break;

        case "collie-isolate-host":
          queueCollieAction("isolate-host", "bangkaew");
          break;

        case "collie-notify-admin":
          queueCollieAction("notify-admin", "bangkaew");
          break;

        case "collie-collect-evidence":
          queueCollieAction("collect-evidence", "bangkaew");
          break;

        case "pitbull-status":
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "Pitbull red team status: Caldera connector offline (demo). 14/14 MITRE tactics covered in playbook library. Last safe simulation: credential access drill (2026-06-20). Connect Caldera in Setup to run live adversary emulation.",
            },
          ]);
          break;

        case "pitbull-simulate":
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "Pitbull cannot run live brute force simulation — Caldera is not connected in this demo. Go to Setup to link Caldera, or review MITRE coverage on Pitbull's page.",
            },
          ]);
          break;

        case "approve-block-ip": {
          const item =
            inboxItems.find((i) => i.type === "approval" && i.id === "B-01") ??
            inboxItems.find(
              (i) => i.type === "approval" && i.title.toLowerCase().includes("block ip")
            );
          if (item) approveInboxItem(item.id);
          else
            setChatMessages((prev) => [
              ...prev,
              { role: "assistant", text: "No pending block IP approval found." },
            ]);
          break;
        }

        case "approve-isolate-host": {
          const item =
            inboxItems.find((i) => i.type === "approval" && i.id === "B-02") ??
            inboxItems.find(
              (i) => i.type === "approval" && i.title.toLowerCase().includes("isolate")
            );
          if (item) approveInboxItem(item.id);
          else
            setChatMessages((prev) => [
              ...prev,
              { role: "assistant", text: "No pending isolate host approval found." },
            ]);
          break;
        }

        default:
          setChatMessages((prev) => [
            ...prev,
            { role: "assistant", text: "Command recognized but not wired yet in this demo." },
          ]);
      }
    },
    [
      assignRetrieverTask,
      approveInboxItem,
      collieJob,
      inboxItems,
      queueCollieAction,
      retrieverJob,
      runShepherdTask,
      setAiProvider,
      shepherdJob,
    ]
  );

  const getAgentStatus = useCallback(
    (agentId: PackAgentId): PackAgentStatus => {
      if (agentId === "retriever") {
        const override = retrieverStatusFromJob(retrieverJob);
        if (override) return override;
      }
      if (agentId === "collie") {
        const override = collieStatusFromJob(collieJob);
        if (override) return override;
      }
      if (agentId === "shepherd") {
        const override = shepherdStatusFromJob(shepherdJob);
        if (override) return override;
      }
      return basePackAgentStatus[agentId];
    },
    [retrieverJob, collieJob, shepherdJob]
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
      collieJob,
      shepherdJob,
      pendingCollieActions,
      retrieverRepos,
      aiProviderId,
      assignRetrieverTask,
      requestCollieAction,
      approveInboxItem,
      addRetrieverRepo,
      removeRetrieverRepo,
      setAiProvider,
      sendBangkaewMessage,
      getAgentStatus,
      getReportsForAgent,
    }),
    [
      chatMessages,
      inboxItems,
      dynamicReports,
      retrieverJob,
      collieJob,
      shepherdJob,
      pendingCollieActions,
      retrieverRepos,
      aiProviderId,
      assignRetrieverTask,
      requestCollieAction,
      approveInboxItem,
      addRetrieverRepo,
      removeRetrieverRepo,
      setAiProvider,
      sendBangkaewMessage,
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
