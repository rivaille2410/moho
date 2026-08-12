import { NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function POST() {
  const { res, unauthorized } = await fetchWithAuth("/auth/me", {
    method: "POST",
  });

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
