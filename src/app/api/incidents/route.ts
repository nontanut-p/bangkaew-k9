import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const incidents = db
    .prepare(`SELECT * FROM incidents WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`)
    .all(session.userId);

  if ((incidents as unknown[]).length === 0) {
    db.prepare(
      `INSERT INTO incidents (user_id, title, severity, status, summary_exec, llm_reasoning)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      session.userId,
      "Brute Force Attack on PC-EXEC",
      "critical",
      "open",
      "50 SSH failures from 45.33.32.156 in 60 seconds",
      "High-risk IP in threat feed. Recommend block + notify admin."
    );
    const fresh = db
      .prepare(`SELECT * FROM incidents WHERE user_id = ? ORDER BY created_at DESC`)
      .all(session.userId);
    return NextResponse.json({ incidents: fresh });
  }

  return NextResponse.json({ incidents });
}
