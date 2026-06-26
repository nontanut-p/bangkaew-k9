import type Database from "better-sqlite3";
import { hashPassword } from "@/lib/auth/password";

export function seedIfEmpty(db: Database.Database) {
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
  if (userCount.c > 0) return;

  const hash = hashPassword("demo1234");
  const result = db
    .prepare(
      `INSERT INTO users (org_name, admin_name, email, password_hash)
       VALUES (?, ?, ?, ?)`
    )
    .run("Acme Corp", "Demo Admin", "demo@bangkaew.local", hash);

  const userId = Number(result.lastInsertRowid);

  db.prepare(
    `INSERT INTO setup_state (user_id, current_step, completed_modules, finished) VALUES (?, ?, ?, ?)`
  ).run(userId, 99, JSON.stringify(["wazuh", "pitbull", "retriever", "collie", "bangkaew"]), 1);

  for (const key of ["wazuh", "pitbull", "retriever", "collie", "bangkaew"]) {
    db.prepare(`INSERT INTO user_modules (user_id, module_key) VALUES (?, ?)`).run(userId, key);
  }

  const agents = [
    { agent_id: "001", hostname: "PC-EXEC", os: "Windows 10", ip: "192.168.1.101", group: "workstations" },
    { agent_id: "002", hostname: "WEB-SRV", os: "Ubuntu 22.04", ip: "192.168.1.102", group: "servers" },
    { agent_id: "003", hostname: "DC-01", os: "Windows Server 2022", ip: "192.168.1.103", group: "servers" },
  ];

  for (const a of agents) {
    db.prepare(
      `INSERT INTO agents (user_id, agent_id, hostname, os, ip_address, agent_group, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`
    ).run(userId, a.agent_id, a.hostname, a.os, a.ip, a.group);
  }

  const repos = [
    { url: "my-org/api-service", branch: "main" },
    { url: "my-org/frontend", branch: "main" },
  ];
  for (const r of repos) {
    const repoResult = db
      .prepare(`INSERT INTO repos (user_id, repo_url, branch, last_scanned_at, status) VALUES (?, ?, ?, datetime('now', '-2 hours'), 'scanned')`)
      .run(userId, r.url, r.branch);
    const repoId = Number(repoResult.lastInsertRowid);
    db.prepare(
      `INSERT INTO scan_findings (repo_id, tool, severity, title, file_path, line_number, description, cve_id)
       VALUES (?, 'semgrep', 'critical', 'SQL injection risk', 'src/api/users.ts', 42, 'User input in raw query', NULL)`
    ).run(repoId);
    db.prepare(
      `INSERT INTO scan_findings (repo_id, tool, severity, title, file_path, line_number, description, cve_id)
       VALUES (?, 'trivy', 'high', 'CVE in dependency', 'package-lock.json', 0, 'lodash prototype pollution', 'CVE-2020-8203')`
    ).run(repoId);
  }
}
