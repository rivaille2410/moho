import { type NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function GET(request: NextRequest) {
  const { search } = new URL(request.url);

  const { res, unauthorized } = await fetchWithAuth(
    `/shipments/shippable-orders${search}`,
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
