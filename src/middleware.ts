import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth/session";

const PUBLIC = ["/", "/th", "/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  const isPublic =
    PUBLIC.includes(pathname) ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/_next") ||
    /\.[a-z0-9]+$/i.test(pathname);

  if (isPublic) return response;

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if ((pathname.startsWith("/demo") || pathname.startsWith("/onboarding") || pathname.startsWith("/api/")) && !token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
