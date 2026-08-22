import { type NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await req.formData();

  const { res, unauthorized } = await fetchWithAuth(`/reviews/${id}/images`, {
    method: "POST",
    body: formData,
  });

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
