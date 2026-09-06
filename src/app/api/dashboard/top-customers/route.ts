import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") ?? "30d";
  const limit = request.nextUrl.searchParams.get("limit") ?? "10";

  const { res, unauthorized } = await fetchWithAuth(
    `/dashboard/top-customers?range=${range}&limit=${limit}`,
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
