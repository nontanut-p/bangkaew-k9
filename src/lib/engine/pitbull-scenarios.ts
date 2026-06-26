export interface PitbullScenario {
  id: string;
  name: string;
  mitreTactic: string;
  description: string;
  risk: string;
  icon: string;
  events: { rule: string; msg: string; severity: string; threshold?: number }[];
  bangkaewMsg: string;
  collieActions: string[];
}

export const PITBULL_SCENARIOS: PitbullScenario[] = [
  {
    id: "T1110",
    name: "Brute Force",
    mitreTactic: "Credential Access",
    description: "Mass SSH/RDP login failures",
    risk: "HIGH",
    icon: "🔴",
    events: [
      { rule: "5710", msg: "sshd: Failed password for {user} from {ip}", severity: "high" },
      { rule: "5712", msg: "Brute force attack detected - 10+ failures", severity: "critical", threshold: 10 },
    ],
    bangkaewMsg: "Brute Force detected — recommend block IP and notify admin",
    collieActions: ["block_ip", "notify_admin"],
  },
  {
    id: "T1059",
    name: "Command & Scripting",
    mitreTactic: "Execution",
    description: "PowerShell encoded payload",
    risk: "HIGH",
    icon: "🟠",
    events: [
      { rule: "100002", msg: "powershell.exe -enc {b64} detected", severity: "high" },
    ],
    bangkaewMsg: "PowerShell Encoded Command — possible fileless malware",
    collieActions: ["kill_process", "isolate_host", "notify_admin"],
  },
  {
    id: "T1003",
    name: "Credential Dumping",
    mitreTactic: "Credential Access",
    description: "Mimikatz / LSASS dump simulation",
    risk: "CRITICAL",
    icon: "🔴",
    events: [
      { rule: "100001", msg: "Mimikatz sekurlsa::logonpasswords detected", severity: "critical" },
    ],
    bangkaewMsg: "CRITICAL: Credential Dumping — system may be compromised",
    collieActions: ["isolate_host", "notify_admin", "collect_forensics"],
  },
  {
    id: "T1046",
    name: "Network Service Scan",
    mitreTactic: "Discovery",
    description: "Nmap scan, port discovery",
    risk: "MEDIUM",
    icon: "🟠",
    events: [
      { rule: "80731", msg: "Suricata: ET SCAN Nmap Scripting Engine", severity: "medium" },
    ],
    bangkaewMsg: "Network Scanning detected — enumerate hosts/services",
    collieActions: ["block_ip", "notify_admin"],
  },
  {
    id: "T1021",
    name: "Lateral Movement",
    mitreTactic: "Lateral Movement",
    description: "PsExec, WMI remote execution",
    risk: "CRITICAL",
    icon: "🔴",
    events: [
      { rule: "100003", msg: "PsExec remote execution detected", severity: "critical" },
    ],
    bangkaewMsg: "CRITICAL: Lateral Movement — attacker pivoting across network",
    collieActions: ["isolate_host", "notify_admin", "collect_forensics"],
  },
  {
    id: "T1190",
    name: "Web App Exploit",
    mitreTactic: "Initial Access",
    description: "SQLi, XSS, directory traversal",
    risk: "HIGH",
    icon: "🟡",
    events: [
      { rule: "31108", msg: "SQL Injection attempt blocked", severity: "high" },
      { rule: "31101", msg: "XSS attempt blocked", severity: "medium" },
    ],
    bangkaewMsg: "Web Application Attack on web server",
    collieActions: ["block_ip", "notify_admin"],
  },
  {
    id: "T1486",
    name: "Data Encryption (Ransom)",
    mitreTactic: "Impact",
    description: "Simulated ransomware file encryption",
    risk: "CRITICAL",
    icon: "🟡",
    events: [
      { rule: "100010", msg: "Mass file rename: .locked extension", severity: "critical" },
      { rule: "100011", msg: "vssadmin.exe delete shadows /all", severity: "critical" },
    ],
    bangkaewMsg: "EMERGENCY: Ransomware activity detected!",
    collieActions: ["isolate_host", "notify_admin", "collect_forensics"],
  },
  {
    id: "T1078",
    name: "Valid Accounts Abuse",
    mitreTactic: "Persistence",
    description: "Admin misuse, after-hours login",
    risk: "HIGH",
    icon: "🟠",
    events: [
      { rule: "5501", msg: "Admin login outside business hours", severity: "high" },
    ],
    bangkaewMsg: "Suspicious admin activity — off-hours login + bulk export",
    collieActions: ["notify_admin", "collect_forensics"],
  },
];

export const TTD_RANGES: Record<string, { min: number; max: number }> = {
  T1110: { min: 2, max: 8 },
  T1059: { min: 5, max: 20 },
  T1003: { min: 8, max: 30 },
  T1046: { min: 1, max: 5 },
  T1021: { min: 15, max: 45 },
  T1486: { min: 3, max: 10 },
  T1190: { min: 4, max: 12 },
  T1078: { min: 6, max: 18 },
};

export function calcScore(ttd: number, rate: number): number {
  const ttdScore = Math.max(0, 100 - ttd * 3);
  const rateScore = rate * 100;
  return Math.round(ttdScore * 0.4 + rateScore * 0.6);
}
