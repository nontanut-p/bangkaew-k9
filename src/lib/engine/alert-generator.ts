import { pickFrom, randomIP, renderTemplate, shuffle, USERNAMES, rand } from "./realism";

export interface ChainEvent {
  delay: number;
  rule: string;
  severity: string;
}

export interface AlertChain {
  name: string;
  probability: number;
  events: ChainEvent[];
  sameIp?: boolean;
  sameAgent?: boolean;
}

export const MOCK_ALERT_POOL = [
  { rule: "5710", desc: "SSH Authentication Failed", severity: "high" },
  { rule: "5712", desc: "SSH Brute Force Attempt (>10 tries)", severity: "critical" },
  { rule: "31101", desc: "Web Attack - XSS Attempt", severity: "medium" },
  { rule: "31108", desc: "Web Attack - SQL Injection", severity: "high" },
  { rule: "1002", desc: "Unknown problem somewhere in the system", severity: "medium" },
  { rule: "5501", desc: "New user added to the system", severity: "low" },
  { rule: "4101", desc: "Rootkit detection - hidden files found", severity: "critical" },
  { rule: "80731", desc: "Suricata: ET SCAN Nmap Scripting Engine", severity: "high" },
  { rule: "100001", desc: "Mimikatz credential dump detected", severity: "critical" },
  { rule: "100002", desc: "PowerShell encoded command execution", severity: "high" },
  { rule: "100003", desc: "Lateral movement via PsExec detected", severity: "critical" },
];

export const ALERT_CHAINS: AlertChain[] = [
  {
    name: "ssh_bruteforce_chain",
    probability: 0.15,
    sameIp: true,
    events: [
      { delay: 0, rule: "5710", severity: "medium" },
      { delay: 2000, rule: "5710", severity: "medium" },
      { delay: 4000, rule: "5710", severity: "medium" },
      { delay: 5000, rule: "5712", severity: "critical" },
    ],
  },
  {
    name: "web_attack_chain",
    probability: 0.12,
    sameIp: true,
    events: [
      { delay: 0, rule: "31101", severity: "low" },
      { delay: 3000, rule: "31108", severity: "high" },
    ],
  },
  {
    name: "recon_chain",
    probability: 0.18,
    sameIp: true,
    events: [
      { delay: 0, rule: "80731", severity: "medium" },
      { delay: 3000, rule: "80731", severity: "medium" },
    ],
  },
  {
    name: "normal_noise",
    probability: 0.55,
    events: [{ delay: 0, rule: "1002", severity: "low" }],
  },
];

export function pickChain(): AlertChain {
  const roll = Math.random();
  let cumulative = 0;
  for (const chain of ALERT_CHAINS) {
    cumulative += chain.probability;
    if (roll <= cumulative) return chain;
  }
  return ALERT_CHAINS[ALERT_CHAINS.length - 1];
}

export function buildAlertFromEvent(
  event: ChainEvent,
  ctx: { ip: string; hostname: string; user: string }
) {
  const description = renderTemplate(event.rule, {
    ip: ctx.ip,
    user: ctx.user,
    port: String(rand(1024, 65535)),
    uri: "/admin",
    b64: "JABjAGwAaQBlAG4AdA...",
    rule: event.rule,
  });
  return {
    rule_id: event.rule,
    description,
    severity: event.severity,
    src_ip: ctx.ip,
    raw_log: description,
    hostname: ctx.hostname,
  };
}

export function generateSingleAlert(hostname: string) {
  const item = pickFrom(MOCK_ALERT_POOL);
  const ip = randomIP();
  const user = pickFrom(USERNAMES);
  return {
    rule_id: item.rule,
    description: renderTemplate(item.rule, { ip, user, port: "22", uri: "/login", b64: "...", rule: item.rule }),
    severity: item.severity,
    src_ip: ip,
    raw_log: item.desc,
    hostname,
  };
}

export function generateBruteForceSequence(
  hostname: string,
  count: number,
  attackerIp = randomIP()
) {
  const users = shuffle(USERNAMES).slice(0, Math.min(count, USERNAMES.length));
  return users.map((user, i) => ({
    delay: i * (800 + Math.random() * 400),
    rule: i >= 10 ? "5712" : "5710",
    severity: i >= 10 ? "critical" : "high",
    description: renderTemplate(i >= 10 ? "5712" : "5710", {
      ip: attackerIp,
      user,
      port: String(22 + rand(0, 100)),
      uri: "/",
      b64: "...",
      rule: i >= 10 ? "5712" : "5710",
    }),
    src_ip: attackerIp,
    hostname,
  }));
}
