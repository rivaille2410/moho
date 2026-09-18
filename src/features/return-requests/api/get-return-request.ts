import { ReturnRequest } from "@/types/return-request";

interface FetchOptions {
  baseUrl?: string;
  cookie?: string;
}

export async function getReturnRequest(
  id: string,
  options: FetchOptions = {},
): Promise<ReturnRequest> {
  const { baseUrl = "", cookie } = options;

  const res = await fetch(`${baseUrl}/api/return-requests/${id}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch return request");
  }

  return res.json();
}
