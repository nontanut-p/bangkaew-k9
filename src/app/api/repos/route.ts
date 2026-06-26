import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const repos = db.prepare("SELECT * FROM repos WHERE user_id = ?").all(session.userId);
  const findings = db
    .prepare(
      `SELECT f.*, r.repo_url FROM scan_findings f
       JOIN repos r ON r.id = f.repo_id
       WHERE r.user_id = ? ORDER BY f.created_at DESC`
    )
    .all(session.userId);

  return NextResponse.json({ repos, findings });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { repo_url, branch = "main" } = body as { repo_url?: string; branch?: string };

  if (!repo_url) {
    return NextResponse.json({ error: "repo_url required" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare(`INSERT INTO repos (user_id, repo_url, branch, status) VALUES (?, ?, ?, 'pending')`)
    .run(session.userId, repo_url, branch);

  const repo = db.prepare("SELECT * FROM repos WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json({ repo });
}
