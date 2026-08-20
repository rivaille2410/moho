import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const { res, unauthorized } = await fetchWithAuth(`/uploads`, {
    method: "POST",
    body: formData,
  });

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
