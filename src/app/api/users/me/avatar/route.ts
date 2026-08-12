import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/auth-fetch";

export async function PATCH(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  const forwardData = new FormData();
  forwardData.append("file", file);

  const { res, unauthorized } = await fetchWithAuth("/users/me/avatar", {
    method: "PATCH",
    body: forwardData,
  });

  if (unauthorized || !res) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
