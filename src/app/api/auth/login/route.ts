import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { COOKIE_NAME, createSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, org_name, email, password_hash FROM users WHERE email = ?")
      .get(email) as { id: number; org_name: string; email: string; password_hash: string } | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      orgName: user.org_name,
    });

    const setup = db
      .prepare("SELECT finished FROM setup_state WHERE user_id = ?")
      .get(user.id) as { finished: number } | undefined;

    const response = NextResponse.json({
      ok: true,
      redirect: setup?.finished ? "/demo" : "/onboarding",
    });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
