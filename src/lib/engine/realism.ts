export interface TimeProfile {
  eps: number;
  alertRate: number;
  criticalChance: number;
}

export function getTimeProfile(hour: number): TimeProfile {
  if (hour >= 2 && hour < 6) return { eps: 80, alertRate: 0.05, criticalChance: 0.3 };
  if (hour >= 6 && hour < 9) return { eps: 320, alertRate: 0.15, criticalChance: 0.1 };
  if (hour >= 9 && hour < 12) return { eps: 850, alertRate: 0.45, criticalChance: 0.08 };
  if (hour >= 12 && hour < 14) return { eps: 620, alertRate: 0.3, criticalChance: 0.06 };
  if (hour >= 14 && hour < 18) return { eps: 900, alertRate: 0.5, criticalChance: 0.09 };
  if (hour >= 18 && hour < 22) return { eps: 380, alertRate: 0.2, criticalChance: 0.12 };
  return { eps: 120, alertRate: 0.08, criticalChance: 0.25 };
}

export const IP_POOLS = {
  known_bad: [
    "45.33.32.156",
    "23.129.64.190",
    "185.220.101.45",
    "89.248.167.131",
    "198.20.99.130",
    "104.131.0.69",
    "167.248.133.100",
  ],
};

export function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomIP(): string {
  if (Math.random() < 0.3) return pickFrom(IP_POOLS.known_bad);
  const subnets = ["45.", "89.", "103.", "185.", "194.", "212."];
  const subnet = pickFrom(subnets);
  return `${subnet}${rand(1, 254)}.${rand(1, 254)}.${rand(1, 254)}`;
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const USERNAMES = [
  "root",
  "admin",
  "administrator",
  "oracle",
  "postgres",
  "ubuntu",
  "ec2-user",
  "test",
  "guest",
  "deploy",
  "jenkins",
];

export const RULE_TEMPLATES: Record<string, string[]> = {
  "5710": [
    "sshd: Failed password for {user} from {ip} port {port} ssh2",
    "sshd: Invalid user {user} from {ip} port {port}",
    "PAM: Authentication failure for {user} from {ip}",
  ],
  "5712": ["sshd: Brute force attack detected - 10+ failures from {ip}"],
  "31108": [
    "WEB Attack: SQL Injection attempt from {ip}: ' OR 1=1--",
    "WEB Attack: UNION SELECT injection from {ip} on {uri}",
  ],
  "31101": ["WEB Attack: XSS attempt from {ip}: <script>alert(1)</script>"],
  "100002": ["powershell.exe -ExecutionPolicy Bypass -enc {b64}"],
  "100001": ["Mimikatz sekurlsa::logonpasswords detected in memory"],
  "80731": ["Suricata: ET SCAN Nmap Scripting Engine from {ip}"],
  "1002": ["Unknown problem somewhere in the system"],
  "5501": ["New user added to the system"],
};

export function renderTemplate(rule: string, vars: Record<string, string>): string {
  const templates = RULE_TEMPLATES[rule] ?? [`Alert rule {rule} triggered`];
  let msg = pickFrom(templates);
  for (const [k, v] of Object.entries(vars)) {
    msg = msg.replace(`{${k}}`, v);
  }
  return msg.replace("{rule}", rule);
}

export class EPSSimulator {
  private current = 450;
  private target = 450;

  tick(): number {
    const profile = getTimeProfile(new Date().getHours());
    if (Math.random() < 0.02) {
      this.target = profile.eps * (0.8 + Math.random() * 0.4);
    }
    this.current += (this.target - this.current) * 0.1;
    this.current += (Math.random() - 0.5) * 20;
    this.current = Math.max(10, Math.round(this.current));
    return this.current;
  }
}

export function generate24hChart(seed: number) {
  const points = [];
  for (let h = 0; h < 24; h++) {
    const profile = getTimeProfile(h);
    const rng = seededRandom(seed + h);
    points.push({
      hour: h,
      critical: Math.round(profile.eps * 0.02 * (0.5 + rng())),
      medium: Math.round(profile.eps * 0.08 * (0.5 + rng())),
      low: Math.round(profile.eps * 0.15 * (0.5 + rng())),
    });
  }
  return points;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function formatTimestampMs(base = new Date()): string {
  const ms = rand(100, 999);
  return `${base.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}.${ms}`;
}
