import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendApiBaseUrl, withBackendTimeout } from "@/lib/backend-api";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });

  if (refreshToken) {
    try {
      await fetch(
        `${getBackendApiBaseUrl()}/auth/logout`,
        withBackendTimeout(
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          },
          AbortSignal.timeout(5_000),
        ),
      );
    } catch {
      // Local cookies are cleared even when the API is temporarily unavailable.
    }
  }

  return response;
}
