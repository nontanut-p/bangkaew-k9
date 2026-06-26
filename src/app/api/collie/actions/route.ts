import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { emitStream } from "@/lib/engine/event-bus";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const actions = db
    .prepare(
      `SELECT * FROM collie_actions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
    )
    .all(session.userId);

  return NextResponse.json({ actions });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { actionId, approve } = body as { actionId?: number; approve?: boolean };

  if (!actionId) {
    return NextResponse.json({ error: "actionId required" }, { status: 400 });
  }

  const db = getDb();
  const action = db.prepare("SELECT * FROM collie_actions WHERE id = ? AND user_id = ?").get(actionId, session.userId) as
    | { id: number; playbook_id: string; target: string; status: string }
    | undefined;

  if (!action) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (approve) {
    db.prepare(
      `UPDATE collie_actions SET status = 'success', approved_by = ?, executed_at = datetime('now') WHERE id = ?`
    ).run(session.userId, actionId);

    emitStream({
      type: "collie_action",
      data: { playbook: action.playbook_id, target: action.target, status: "success" },
    });
  } else {
    db.prepare(`UPDATE collie_actions SET status = 'failed' WHERE id = ?`).run(actionId);
  }

  return NextResponse.json({ ok: true });
}
