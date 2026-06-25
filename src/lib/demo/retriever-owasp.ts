/** OWASP Top 10 (2021) — used by Retriever baseline scans */
export interface OwaspCategory {
  id: string;
  rank: string;
  name: string;
  findings: number;
  status: "ok" | "warn" | "critical";
  tools: string[];
}

export const owaspTop10: OwaspCategory[] = [
  {
    id: "A01",
    rank: "A01",
    name: "Broken Access Control",
    findings: 0,
    status: "ok",
    tools: ["Semgrep", "OWASP"],
  },
  {
    id: "A02",
    rank: "A02",
    name: "Cryptographic Failures",
    findings: 1,
    status: "warn",
    tools: ["Gitleaks", "Semgrep"],
  },
  {
    id: "A03",
    rank: "A03",
    name: "Injection",
    findings: 1,
    status: "critical",
    tools: ["Semgrep", "OWASP"],
  },
  {
    id: "A04",
    rank: "A04",
    name: "Insecure Design",
    findings: 0,
    status: "ok",
    tools: ["Semgrep"],
  },
  {
    id: "A05",
    rank: "A05",
    name: "Security Misconfiguration",
    findings: 1,
    status: "warn",
    tools: ["Trivy", "Semgrep"],
  },
  {
    id: "A06",
    rank: "A06",
    name: "Vulnerable Components",
    findings: 1,
    status: "warn",
    tools: ["Trivy", "OWASP Dependency-Check"],
  },
  {
    id: "A07",
    rank: "A07",
    name: "Identification & Auth Failures",
    findings: 1,
    status: "warn",
    tools: ["Semgrep", "OWASP"],
  },
  {
    id: "A08",
    rank: "A08",
    name: "Software & Data Integrity",
    findings: 0,
    status: "ok",
    tools: ["Trivy", "Gitleaks"],
  },
  {
    id: "A09",
    rank: "A09",
    name: "Security Logging Failures",
    findings: 0,
    status: "ok",
    tools: ["Semgrep"],
  },
  {
    id: "A10",
    rank: "A10",
    name: "Server-Side Request Forgery",
    findings: 0,
    status: "ok",
    tools: ["Semgrep", "OWASP"],
  },
];

export const retrieverScanStack = [
  "Semgrep",
  "Trivy",
  "Gitleaks",
  "OWASP Top 10",
] as const;

export function owaspCoverageSummary() {
  const withFindings = owaspTop10.filter((c) => c.findings > 0).length;
  const totalFindings = owaspTop10.reduce((s, c) => s + c.findings, 0);
  return {
    categoriesHit: withFindings,
    totalCategories: owaspTop10.length,
    totalFindings,
    coverageLabel: `${10 - withFindings}/10 clean`,
  };
}
