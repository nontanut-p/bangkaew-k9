import type { PackAgentId } from "./pack-agents";

export type CommandCategory = "status" | "monitor" | "fix" | "respond" | "test";

export interface BangkaewCommand {
  id: string;
  agent: PackAgentId | "bangkaew";
  category: CommandCategory;
  example: string;
  hint: string;
  action: string;
}

/** Example prompts — click or type similar text in chat */
export const bangkaewCommandExamples: BangkaewCommand[] = [
  {
    id: "status-score",
    agent: "bangkaew",
    category: "status",
    example: "What's our security score right now?",
    hint: "Posture summary",
    action: "status-score",
  },
  {
    id: "status-incidents",
    agent: "bangkaew",
    category: "status",
    example: "Summarize open incidents",
    hint: "Incident overview",
    action: "status-incidents",
  },
  {
    id: "status-pack",
    agent: "bangkaew",
    category: "status",
    example: "What is each agent doing?",
    hint: "Pack status",
    action: "status-pack",
  },
  {
    id: "shepherd-endpoints",
    agent: "shepherd",
    category: "monitor",
    example: "Shepherd, report endpoint health",
    hint: "Wazuh endpoint scan",
    action: "shepherd-endpoints",
  },
  {
    id: "shepherd-alerts",
    agent: "shepherd",
    category: "monitor",
    example: "Shepherd, show critical alerts from today",
    hint: "Latest Wazuh alerts",
    action: "shepherd-alerts",
  },
  {
    id: "shepherd-compliance",
    agent: "shepherd",
    category: "monitor",
    example: "Shepherd, send OWASP and compliance posture",
    hint: "SCA + compliance report",
    action: "shepherd-compliance",
  },
  {
    id: "retriever-scan-web",
    agent: "retriever",
    category: "fix",
    example: "Retriever, scan acme/web-app for vulnerabilities",
    hint: "Baseline + OWASP scan",
    action: "retriever-baseline-web-app",
  },
  {
    id: "retriever-patch",
    agent: "retriever",
    category: "fix",
    example: "Retriever, patch CVE on acme/api-service",
    hint: "Open fix PR",
    action: "retriever-patch-cve-lodash",
  },
  {
    id: "retriever-ai",
    agent: "retriever",
    category: "fix",
    example: "Retriever, use Claude for the next fix",
    hint: "Switch AI provider",
    action: "retriever-ai-claude",
  },
  {
    id: "collie-block",
    agent: "collie",
    category: "respond",
    example: "Collie, prepare to block IP 203.150.10.88",
    hint: "Needs your approval",
    action: "collie-block-ip",
  },
  {
    id: "collie-isolate",
    agent: "collie",
    category: "respond",
    example: "Collie, isolate it-laptop-02",
    hint: "EDR playbook · approve first",
    action: "collie-isolate-host",
  },
  {
    id: "collie-notify",
    agent: "collie",
    category: "respond",
    example: "Collie, notify admin about INC-2026-039",
    hint: "Email + LINE alert",
    action: "collie-notify-admin",
  },
  {
    id: "collie-evidence",
    agent: "collie",
    category: "respond",
    example: "Collie, collect evidence on it-laptop-02",
    hint: "Forensic snapshot",
    action: "collie-collect-evidence",
  },
  {
    id: "pitbull-status",
    agent: "pitbull",
    category: "test",
    example: "Pitbull, what's your red team status?",
    hint: "Simulation readiness",
    action: "pitbull-status",
  },
  {
    id: "pitbull-sim",
    agent: "pitbull",
    category: "test",
    example: "Pitbull, run a safe brute force simulation",
    hint: "Attack simulation",
    action: "pitbull-simulate",
  },
  {
    id: "approve-block",
    agent: "bangkaew",
    category: "respond",
    example: "Approve block IP",
    hint: "Confirm Collie action",
    action: "approve-block-ip",
  },
  {
    id: "approve-isolate",
    agent: "bangkaew",
    category: "respond",
    example: "Approve isolate host",
    hint: "Confirm Collie action",
    action: "approve-isolate-host",
  },
];

const categoryLabel: Record<CommandCategory, string> = {
  status: "Status",
  monitor: "Monitor",
  fix: "Fix code",
  respond: "Respond",
  test: "Red team",
};

const agentLabel: Record<PackAgentId | "bangkaew", string> = {
  bangkaew: "Bangkaew",
  shepherd: "Shepherd",
  retriever: "Retriever",
  collie: "Collie",
  pitbull: "Pitbull",
};

export function getCommandGroups() {
  const agents: (PackAgentId | "bangkaew")[] = [
    "bangkaew",
    "shepherd",
    "retriever",
    "collie",
    "pitbull",
  ];
  return agents
    .map((agent) => ({
      agent,
      label: agentLabel[agent],
      commands: bangkaewCommandExamples.filter((c) => c.agent === agent),
    }))
    .filter((g) => g.commands.length > 0);
}

export { categoryLabel, agentLabel };

export function resolveBangkaewCommand(text: string): BangkaewCommand | null {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return null;

  const exact = bangkaewCommandExamples.find((c) => c.example.toLowerCase() === normalized);
  if (exact) return exact;

  const rules: { test: RegExp | ((s: string) => boolean); action: string }[] = [
    { test: /security score|posture score|score right now/, action: "status-score" },
    { test: /open incident|summarize incident|incident overview/, action: "status-incidents" },
    { test: /each agent|pack status|what.*doing/, action: "status-pack" },
    { test: /shepherd.*endpoint|endpoint health|report endpoint/, action: "shepherd-endpoints" },
    { test: /shepherd.*alert|critical alert/, action: "shepherd-alerts" },
    { test: /shepherd.*compliance|owasp.*posture|sca posture/, action: "shepherd-compliance" },
    { test: /retriever.*scan.*web-app|scan acme\/web-app|baseline.*web-app/, action: "retriever-baseline-web-app" },
    { test: /retriever.*patch|patch cve|cve.*api-service/, action: "retriever-patch-cve-lodash" },
    { test: /retriever.*rescan|verify pr-43/, action: "retriever-rescan-api" },
    { test: /retriever.*claude|use claude/, action: "retriever-ai-claude" },
    { test: /retriever.*deepseek|use deepseek/, action: "retriever-ai-deepseek" },
    { test: /retriever.*glm|use glm/, action: "retriever-ai-glm" },
    { test: /collie.*block|block ip|prepare.*block/, action: "collie-block-ip" },
    { test: /collie.*isolate|isolate.*laptop|isolate host/, action: "collie-isolate-host" },
    { test: /collie.*notify|notify admin/, action: "collie-notify-admin" },
    { test: /collie.*evidence|collect evidence/, action: "collie-collect-evidence" },
    { test: /pitbull.*status|red team status/, action: "pitbull-status" },
    { test: /pitbull.*sim|brute force sim|run.*simulation/, action: "pitbull-simulate" },
    { test: /^approve block/, action: "approve-block-ip" },
    { test: /^approve isolate/, action: "approve-isolate-host" },
  ];

  for (const rule of rules) {
    const match =
      typeof rule.test === "function" ? rule.test(normalized) : rule.test.test(normalized);
    if (match) {
      return bangkaewCommandExamples.find((c) => c.action === rule.action) ?? null;
    }
  }

  return null;
}

export const commandCategoryStyle: Record<CommandCategory, string> = {
  status: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  monitor: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  fix: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  respond: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  test: "border-amber-500/30 bg-amber-500/10 text-amber-200",
};
