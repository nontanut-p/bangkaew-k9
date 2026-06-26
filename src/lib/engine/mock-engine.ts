import { getDb, type DbAgent } from "@/lib/db/client";
import { ALERT_CHAINS, buildAlertFromEvent, generateSingleAlert, pickChain } from "./alert-generator";
import { emitStream } from "./event-bus";
import { EPSSimulator, getTimeProfile, pickFrom, randomIP, USERNAMES } from "./realism";

const globalEngine = globalThis as unknown as {
  mockEngineStarted?: boolean;
  epsSim?: EPSSimulator;
  chainTimer?: ReturnType<typeof setTimeout>;
  agentTimer?: ReturnType<typeof setInterval>;
  epsTimer?: ReturnType<typeof setInterval>;
};

function getAgentsForUser(userId: number): DbAgent[] {
  const db = getDb();
  return db.prepare("SELECT * FROM agents WHERE user_id = ?").all(userId) as DbAgent[];
}

function insertAlert(userId: number, agentDbId: number | null, alert: {
  rule_id: string;
  description: string;
  severity: string;
  src_ip: string;
  raw_log: string;
  hostname?: string;
}) {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO alerts (user_id, agent_id, rule_id, description, severity, src_ip, raw_log)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(userId, agentDbId, alert.rule_id, alert.description, alert.severity, alert.src_ip, alert.raw_log);

  const row = db
    .prepare(
      `SELECT a.*, ag.hostname FROM alerts a
       LEFT JOIN agents ag ON ag.id = a.agent_id
       WHERE a.id = ?`
    )
    .get(result.lastInsertRowid) as Record<string, unknown>;

  emitStream({ type: "new_alert", alert: row });

  if (alert.severity === "critical") {
    emitStream({
      type: "bangkaew_alert",
      data: {
        title: "Security Alert",
        message: alert.description,
        severity: alert.severity,
        hostname: alert.hostname,
        srcIp: alert.src_ip,
        collieActions: ["block_ip", "notify_admin"],
      },
    });
  }

  return row;
}

function fireChain(userId: number) {
  const agents = getAgentsForUser(userId);
  if (agents.length === 0) return;

  const chain = pickChain();
  const ip = randomIP();
  const agent = pickFrom(agents);
  const user = pickFrom(USERNAMES);

  for (const event of chain.events) {
    setTimeout(() => {
      const alert = buildAlertFromEvent(event, { ip, hostname: agent.hostname, user });
      insertAlert(userId, agent.id, alert);
    }, event.delay);
  }
}

function randomizeAgents(userId: number) {
  const db = getDb();
  const agents = getAgentsForUser(userId);
  for (const agent of agents) {
    const roll = Math.random();
    const status = roll < 0.05 ? "slow" : roll < 0.08 ? "disconnected" : "active";
    db.prepare(`UPDATE agents SET status = ?, last_seen = datetime('now') WHERE id = ?`).run(status, agent.id);
  }
  const updated = getAgentsForUser(userId);
  emitStream({ type: "agent_update", agents: updated as unknown as Record<string, unknown>[] });
}

export function startMockEngine() {
  if (globalEngine.mockEngineStarted) return;
  globalEngine.mockEngineStarted = true;
  globalEngine.epsSim = new EPSSimulator();

  const userId = 1;

  function scheduleNextChain() {
    const profile = getTimeProfile(new Date().getHours());
    const jitter = 8000 + Math.random() * 37000;
    const delay = jitter / Math.max(profile.alertRate, 0.05);

    globalEngine.chainTimer = setTimeout(() => {
      if (Math.random() > 0.35) fireChain(userId);
      scheduleNextChain();
    }, delay);
  }

  scheduleNextChain();

  globalEngine.agentTimer = setInterval(() => randomizeAgents(userId), 10000);

  globalEngine.epsTimer = setInterval(() => {
    const eps = globalEngine.epsSim!.tick();
    emitStream({ type: "eps_update", eps });
  }, 30000);
}

export function pushAlertForUser(
  userId: number,
  agentDbId: number,
  alert: Parameters<typeof insertAlert>[2]
) {
  return insertAlert(userId, agentDbId, alert);
}

export { insertAlert, getAgentsForUser };
