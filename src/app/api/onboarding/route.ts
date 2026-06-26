import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

const MODULES = [
  { key: "wazuh", name: "Wazuh SIEM", icon: "🛡️", desc: "Detect threats, ingest endpoint logs" },
  { key: "pitbull", name: "Pitbull Red Team", icon: "🔴", desc: "MITRE ATT&CK attack simulation" },
  { key: "retriever", name: "Retriever Code Sec", icon: "🔍", desc: "Scan GitHub repos + auto-fix" },
  { key: "collie", name: "Collie Automation", icon: "🤖", desc: "SOAR playbooks for response" },
  { key: "bangkaew", name: "Bangkaew AI Brain", icon: "🧠", desc: "AI incident analysis + reports" },
];

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const setup = db.prepare("SELECT * FROM setup_state WHERE user_id = ?").get(session.userId) as
    | { current_step: number; completed_modules: string; finished: number }
    | undefined;
  const modules = db
    .prepare("SELECT module_key, enabled FROM user_modules WHERE user_id = ?")
    .all(session.userId);
  const integrations = db
    .prepare("SELECT module_key, config_json FROM integrations WHERE user_id = ?")
    .all(session.userId);

  return NextResponse.json({
    modules: MODULES,
    selected: modules,
    setup: setup ?? { current_step: 0, completed_modules: "[]", finished: 0 },
    integrations,
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { step, moduleKeys, moduleKey, config, finish } = body as {
    step?: number;
    moduleKeys?: string[];
    moduleKey?: string;
    config?: Record<string, string>;
    finish?: boolean;
  };

  const db = getDb();

  if (moduleKeys?.length) {
    for (const key of moduleKeys) {
      db.prepare(
        `INSERT OR IGNORE INTO user_modules (user_id, module_key) VALUES (?, ?)`
      ).run(session.userId, key);
    }
    db.prepare(`UPDATE setup_state SET current_step = ? WHERE user_id = ?`).run(1, session.userId);
  }

  if (moduleKey && config) {
    db.prepare(
      `INSERT INTO integrations (user_id, module_key, config_json, updated_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, module_key) DO UPDATE SET config_json = excluded.config_json, updated_at = datetime('now')`
    ).run(session.userId, moduleKey, JSON.stringify(config));

    const setup = db.prepare("SELECT completed_modules FROM setup_state WHERE user_id = ?").get(session.userId) as
      | { completed_modules: string }
      | undefined;
    const completed = JSON.parse(setup?.completed_modules ?? "[]") as string[];
    if (!completed.includes(moduleKey)) completed.push(moduleKey);
    db.prepare(`UPDATE setup_state SET completed_modules = ?, current_step = ? WHERE user_id = ?`).run(
      JSON.stringify(completed),
      step ?? completed.length,
      session.userId
    );
  }

  if (finish) {
    db.prepare(`UPDATE setup_state SET finished = 1, current_step = 99 WHERE user_id = ?`).run(session.userId);
  }

  return NextResponse.json({ ok: true });
}
