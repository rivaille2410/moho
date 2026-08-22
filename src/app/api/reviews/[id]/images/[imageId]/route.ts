import { type NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { id, imageId } = await params;
  const { res, unauthorized } = await fetchWithAuth(
    `/reviews/${id}/images/${imageId}`,
    { method: "DELETE" },
  );
  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
