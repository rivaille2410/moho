import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  if (refreshToken) {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({}),
    });
  }

  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
