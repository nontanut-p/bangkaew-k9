import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { startMockEngine } from "@/lib/engine/mock-engine";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  startMockEngine();
  const db = getDb();
  const agents = db.prepare("SELECT * FROM agents WHERE user_id = ? ORDER BY agent_id").all(session.userId);
  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { hostname, ip_address, os, agent_group } = body as {
    hostname?: string;
    ip_address?: string;
    os?: string;
    agent_group?: string;
  };

  if (!hostname || !ip_address) {
    return NextResponse.json({ error: "Hostname and IP required" }, { status: 400 });
  }

  const db = getDb();
  const count = db.prepare("SELECT COUNT(*) as c FROM agents WHERE user_id = ?").get(session.userId) as {
    c: number;
  };
  const agentId = String(count.c + 1).padStart(3, "0");

  const result = db
    .prepare(
      `INSERT INTO agents (user_id, agent_id, hostname, os, ip_address, agent_group, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`
    )
    .run(session.userId, agentId, hostname, os ?? "Unknown", ip_address, agent_group ?? "default");

  const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json({ agent });
}
