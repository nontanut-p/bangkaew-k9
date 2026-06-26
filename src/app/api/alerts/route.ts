import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { startMockEngine } from "@/lib/engine/mock-engine";
import { EPSSimulator, generate24hChart } from "@/lib/engine/realism";

const epsSim = new EPSSimulator();

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  startMockEngine();
  const db = getDb();
  const limit = Number(new URL(request.url).searchParams.get("limit") ?? 50);

  const alerts = db
    .prepare(
      `SELECT a.*, ag.hostname FROM alerts a
       LEFT JOIN agents ag ON ag.id = a.agent_id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC LIMIT ?`
    )
    .all(session.userId, limit);

  const agents = db.prepare("SELECT * FROM agents WHERE user_id = ?").all(session.userId) as {
    status: string;
  }[];
  const active = agents.filter((a) => a.status === "active").length;
  const disconnected = agents.filter((a) => a.status === "disconnected").length;
  const critical = (alerts as { severity: string }[]).filter((a) => a.severity === "critical").length;

  const today = new Date().toISOString().slice(0, 10);
  const seed = today.split("-").reduce((s, p) => s + Number(p), 0);

  return NextResponse.json({
    alerts,
    kpis: {
      totalAgents: agents.length,
      active,
      disconnected,
      criticalAlerts: critical,
      eps: epsSim.tick(),
    },
    chart24h: generate24hChart(seed),
    topRules: [
      { rule: "5710", label: "SSH Auth Failed", count: 847 },
      { rule: "1002", label: "Unknown Problem", count: 612 },
      { rule: "5501", label: "New User Created", count: 445 },
      { rule: "31101", label: "Web Attack", count: 389 },
      { rule: "4101", label: "Rootkit Detected", count: 201 },
    ],
  });
}
