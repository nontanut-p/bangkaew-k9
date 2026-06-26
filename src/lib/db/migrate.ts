import type Database from "better-sqlite3";

export function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_name TEXT NOT NULL,
      admin_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      module_key TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, module_key)
    );

    CREATE TABLE IF NOT EXISTS integrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      module_key TEXT NOT NULL,
      config_json TEXT NOT NULL DEFAULT '{}',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, module_key)
    );

    CREATE TABLE IF NOT EXISTS setup_state (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      current_step INTEGER DEFAULT 0,
      completed_modules TEXT DEFAULT '[]',
      finished INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      agent_id TEXT NOT NULL,
      hostname TEXT NOT NULL,
      os TEXT,
      ip_address TEXT,
      status TEXT DEFAULT 'active',
      agent_group TEXT DEFAULT 'default',
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      agent_id INTEGER REFERENCES agents(id),
      rule_id TEXT,
      description TEXT,
      severity TEXT,
      src_ip TEXT,
      raw_log TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attack_simulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      scenario_id TEXT,
      target_agent_id INTEGER REFERENCES agents(id),
      status TEXT DEFAULT 'running',
      total_events INTEGER DEFAULT 0,
      detected_events INTEGER DEFAULT 0,
      ttd_seconds REAL,
      ttr_seconds REAL,
      report_json TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS collie_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      incident_id INTEGER,
      playbook_id TEXT,
      target TEXT,
      status TEXT DEFAULT 'pending',
      trigger_source TEXT DEFAULT 'manual',
      approved_by TEXT,
      executed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS repos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      repo_url TEXT NOT NULL,
      branch TEXT DEFAULT 'main',
      last_scanned_at DATETIME,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS scan_findings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repo_id INTEGER NOT NULL REFERENCES repos(id),
      tool TEXT,
      severity TEXT,
      title TEXT,
      file_path TEXT,
      line_number INTEGER,
      description TEXT,
      cve_id TEXT,
      fixed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT,
      severity TEXT,
      status TEXT DEFAULT 'open',
      summary_th TEXT,
      summary_exec TEXT,
      llm_reasoning TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME
    );

    CREATE INDEX IF NOT EXISTS idx_alerts_user_created ON alerts(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_agents_user ON agents(user_id);
  `);
}
