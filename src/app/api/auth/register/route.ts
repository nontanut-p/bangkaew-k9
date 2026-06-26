import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { COOKIE_NAME, createSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { org_name, admin_name, email, password } = body as {
      org_name?: string;
      admin_name?: string;
      email?: string;
      password?: string;
    };

    if (!org_name || !admin_name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const result = db
      .prepare(
        `INSERT INTO users (org_name, admin_name, email, password_hash) VALUES (?, ?, ?, ?)`
      )
      .run(org_name, admin_name, email, hashPassword(password));

    const userId = Number(result.lastInsertRowid);
    db.prepare(`INSERT INTO setup_state (user_id) VALUES (?)`).run(userId);

    const token = await createSession({ userId, email, orgName: org_name });

    const response = NextResponse.json({ ok: true, redirect: "/onboarding" });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
