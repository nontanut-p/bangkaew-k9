import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "bangkaew_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "bangkaew-k9-demo-secret-change-in-production"
);

export interface SessionPayload {
  userId: number;
  email: string;
  orgName: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: Number(payload.userId),
      email: String(payload.email),
      orgName: String(payload.orgName),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return Promise.resolve(null);
  return verifySession(token);
}

export { COOKIE_NAME };
