import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { generateBruteForceSequence } from "@/lib/engine/alert-generator";
import { emitStream } from "@/lib/engine/event-bus";
import { getAgentsForUser, pushAlertForUser } from "@/lib/engine/mock-engine";
import {
  calcScore,
  PITBULL_SCENARIOS,
  TTD_RANGES,
  type PitbullScenario,
} from "@/lib/engine/pitbull-scenarios";
import { formatTimestampMs, randomIP, renderTemplate, USERNAMES, pickFrom } from "@/lib/engine/realism";

export async function GET() {
  return NextResponse.json({ scenarios: PITBULL_SCENARIOS });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { scenarioId, targetAgentId, eventCount = 50, speed = "normal" } = body as {
    scenarioId?: string;
    targetAgentId?: number;
    eventCount?: number;
    speed?: "slow" | "normal" | "fast";
  };

  const scenario = PITBULL_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario || !targetAgentId) {
    return NextResponse.json({ error: "Invalid scenario or target" }, { status: 400 });
  }

  const agents = getAgentsForUser(session.userId);
  const target = agents.find((a) => a.id === targetAgentId);
  if (!target) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const db = getDb();
  const simResult = db
    .prepare(
      `INSERT INTO attack_simulations (user_id, scenario_id, target_agent_id, status, total_events)
       VALUES (?, ?, ?, 'running', ?)`
    )
    .run(session.userId, scenarioId, targetAgentId, eventCount);

  const simId = Number(simResult.lastInsertRowid);
  const batchMs = speed === "slow" ? 5000 : speed === "fast" ? 500 : 2000;
  const attackerIp = randomIP();
  const startedAt = Date.now();

  const events =
    scenario.id === "T1110"
      ? generateBruteForceSequence(target.hostname, eventCount, attackerIp)
      : buildScenarioEvents(scenario, target.hostname, eventCount, attackerIp);

  let sent = 0;
  const logs: string[] = [];

  emitStream({
    type: "attack_progress",
    data: {
      simId,
      status: "started",
      log: `[${formatTimestampMs()}] Initializing attack sequence...`,
      progress: 0,
      total: eventCount,
    },
  });

  let finished = false;

  for (const ev of events) {
    setTimeout(() => {
      if (finished) return;
      sent++;
      const logLine = `[${formatTimestampMs()}] → Rule ${ev.rule} fired on ${target.hostname}`;
      logs.push(logLine);

      pushAlertForUser(session.userId, target.id, {
        rule_id: ev.rule,
        description: ev.description,
        severity: ev.severity,
        src_ip: ev.src_ip ?? attackerIp,
        raw_log: ev.description,
        hostname: target.hostname,
      });

      emitStream({
        type: "attack_progress",
        data: {
          simId,
          status: "running",
          log: logLine,
          progress: sent,
          total: eventCount,
        },
      });

      if (sent >= eventCount) {
        finished = true;
        finishAttack(session.userId, simId, scenario, target.hostname, eventCount, startedAt, attackerIp);
      }
    }, ev.delay ?? sent * batchMs);
  }

  return NextResponse.json({ ok: true, simId, scenario: scenario.id, target: target.hostname });
}

function buildScenarioEvents(
  scenario: PitbullScenario,
  hostname: string,
  count: number,
  ip: string
) {
  const events = [];
  for (let i = 0; i < count; i++) {
    const template = scenario.events[i % scenario.events.length];
    events.push({
      delay: i * 800,
      rule: template.rule,
      severity: template.severity,
      description: renderTemplate(template.rule, {
        ip,
        user: pickFrom(USERNAMES),
        port: "22",
        uri: "/admin",
        b64: "JABjAGwA...",
        rule: template.rule,
      }),
      src_ip: ip,
      hostname,
    });
  }
  return events;
}

function finishAttack(
  userId: number,
  simId: number,
  scenario: PitbullScenario,
  hostname: string,
  total: number,
  startedAt: number,
  srcIp: string
) {
  const ttdRange = TTD_RANGES[scenario.id] ?? { min: 3, max: 10 };
  const ttd = ttdRange.min + Math.random() * (ttdRange.max - ttdRange.min);
  const ttr = 5 + Math.random() * 10;
  const detectionRate = 0.82 + Math.random() * 0.16;
  const detected = Math.round(total * detectionRate);
  const score = calcScore(ttd, detectionRate);
  const durationSec = Math.round((Date.now() - startedAt) / 1000);

  const report = {
    scenario: scenario.id,
    scenarioName: scenario.name,
    target: hostname,
    durationSec,
    totalEvents: total,
    detectedEvents: detected,
    ttd: Math.round(ttd * 10) / 10,
    ttr: Math.round(ttr * 10) / 10,
    score,
    recommendations: [
      "Detection pipeline responded within SLA",
      "Consider rate limiting on exposed services",
      "Review MFA coverage for admin accounts",
    ],
  };

  const db = getDb();
  db.prepare(
    `UPDATE attack_simulations SET status = 'completed', detected_events = ?, ttd_seconds = ?, ttr_seconds = ?, report_json = ?, finished_at = datetime('now') WHERE id = ?`
  ).run(detected, ttd, ttr, JSON.stringify(report), simId);

  emitStream({
    type: "bangkaew_alert",
    data: {
      title: "Bangkaew AI — Security Alert",
      message: scenario.bangkaewMsg,
      severity: scenario.risk === "CRITICAL" ? "critical" : "high",
      hostname,
      srcIp,
      collieActions: scenario.collieActions,
    },
  });

  emitStream({
    type: "attack_complete",
    data: { simId, report },
  });

  for (const action of scenario.collieActions.slice(0, 2)) {
    db.prepare(
      `INSERT INTO collie_actions (user_id, playbook_id, target, status, trigger_source)
       VALUES (?, ?, ?, 'pending', 'bangkaew')`
    ).run(userId, action, action === "block_ip" ? srcIp : hostname);
  }
}
