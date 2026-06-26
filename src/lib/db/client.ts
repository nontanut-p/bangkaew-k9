import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { migrate } from "./migrate";
import { seedIfEmpty } from "./seed";

const globalForDb = globalThis as unknown as { bangkaewDb?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.bangkaewDb) {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, "bangkaew.db");
    globalForDb.bangkaewDb = new Database(dbPath);
    globalForDb.bangkaewDb.pragma("journal_mode = WAL");
    migrate(globalForDb.bangkaewDb);
    seedIfEmpty(globalForDb.bangkaewDb);
  }
  return globalForDb.bangkaewDb;
}

export type DbUser = {
  id: number;
  org_name: string;
  admin_name: string;
  email: string;
  created_at: string;
};

export type DbAgent = {
  id: number;
  user_id: number;
  agent_id: string;
  hostname: string;
  os: string | null;
  ip_address: string | null;
  status: string;
  agent_group: string;
  last_seen: string;
};

export type DbAlert = {
  id: number;
  user_id: number;
  agent_id: number | null;
  rule_id: string | null;
  description: string | null;
  severity: string | null;
  src_ip: string | null;
  raw_log: string | null;
  created_at: string;
  hostname?: string;
};
