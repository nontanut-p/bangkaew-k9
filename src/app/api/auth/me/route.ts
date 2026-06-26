import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const db = getDb();
  const user = db
    .prepare("SELECT id, org_name, admin_name, email FROM users WHERE id = ?")
    .get(session.userId);

  const setup = db
    .prepare("SELECT finished FROM setup_state WHERE user_id = ?")
    .get(session.userId) as { finished: number } | undefined;

  return NextResponse.json({ user, onboardingComplete: Boolean(setup?.finished) });
}
