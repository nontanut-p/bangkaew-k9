import type { Repository } from "./types";

export interface AiProviderOption {
  id: string;
  name: string;
  vendor: string;
  model: string;
  icon: string;
  description: string;
  strengths: string[];
}

export const aiProviderOptions: AiProviderOption[] = [
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    model: "claude-sonnet-4",
    icon: "🧠",
    description: "Strong at security reasoning and multi-file patches",
    strengths: ["Security analysis", "Large context", "Explainable diffs"],
  },
  {
    id: "codex",
    name: "Codex",
    vendor: "OpenAI",
    model: "gpt-4.1",
    icon: "⚡",
    description: "Fast code generation for common vulnerability patterns",
    strengths: ["Quick fixes", "Test generation", "Refactors"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    model: "deepseek-coder",
    icon: "🔬",
    description: "Cost-efficient coder model for dependency and config fixes",
    strengths: ["CVE patches", "Lockfile updates", "Low cost"],
  },
  {
    id: "glm",
    name: "GLM",
    vendor: "Zhipu AI",
    model: "glm-4",
    icon: "🌏",
    description: "Multilingual fixes with good Thai/English commit messages",
    strengths: ["Bilingual PRs", "Docs", "Policy-aware fixes"],
  },
  {
    id: "local",
    name: "Local LLM",
    vendor: "Ollama / vLLM",
    model: "qwen2.5-coder:14b",
    icon: "🏠",
    description: "On-prem model — code never leaves your network",
    strengths: ["Air-gapped", "Data residency", "Custom fine-tune"],
  },
];

export const repoStackOptions = [
  "Node.js",
  "Python",
  "Go",
  "Java",
  "Terraform",
  "React Native",
  "Rust",
] as const;

export type RepoStack = (typeof repoStackOptions)[number];

export function createRepository(name: string, stack: RepoStack): Repository {
  const id = `repo-${Date.now()}`;
  const now = new Date();
  const lastScan = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return {
    id,
    name: normalizeRepoName(name),
    stack,
    lastScan,
    riskLevel: "Medium",
    openFindings: 0,
    openPrs: 0,
    cicdGate: "Disabled",
    branchProtection: "Disabled",
  };
}

export function normalizeRepoName(input: string): string {
  return input.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\.git$/i, "").replace(/\/+$/, "");
}

export function isValidRepoName(name: string): boolean {
  return /^[\w.-]+\/[\w.-]+$/.test(normalizeRepoName(name));
}

export function getAiProvider(id: string): AiProviderOption | undefined {
  return aiProviderOptions.find((p) => p.id === id);
}
