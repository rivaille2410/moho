import { type NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function GET(request: NextRequest) {
  const { search } = new URL(request.url);

  const { res, unauthorized } = await fetchWithAuth(
    `/products/export${search}`,
  );

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!res.ok) {
    return new Response(await res.text(), { status: res.status });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        res.headers.get("Content-Disposition") ??
        "attachment; filename=products.xlsx",
    },
  });
}
