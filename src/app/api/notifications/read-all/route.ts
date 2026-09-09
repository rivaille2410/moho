import { NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function PATCH() {
  const { res, unauthorized } = await fetchWithAuth("/notifications/read-all", {
    method: "PATCH",
  });

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
