import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  if (refreshToken) {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }

  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
