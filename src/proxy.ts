import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/checkout", "/cart"];
const ADMIN_BLOCKED_PREFIXES = ["/checkout", "/cart"];
const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const HOME_PATH = "/";
const AUTH_QUERY_PARAM = "auth";

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder("utf-8").decode(bytes);

    const decoded = JSON.parse(json);
    return decoded?.role ?? null;
  } catch (err) {
    console.error("Failed to decode token in middleware:", err);
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    const homeUrl = new URL(HOME_PATH, request.url);
    homeUrl.searchParams.set(AUTH_QUERY_PARAM, "required");
    homeUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(homeUrl);
  }

  const isAdminBlocked = ADMIN_BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAdminBlocked) {
    const role = getRoleFromToken(accessToken);
    if (role === "ADMIN") {
      const homeUrl = new URL(HOME_PATH, request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/cart/:path*"],
};
