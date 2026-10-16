import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getBackendApiBaseUrl, withBackendTimeout } from "@/lib/backend-api";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function revalidatePublicDataForMutation(
  path: string,
  method: string,
  response: Response,
) {
  if (method === "GET" || !response.ok) return;

  const normalizedPath = path.split("?")[0];
  if (/^\/products(?:\/|$)/.test(normalizedPath)) {
    revalidateTag("public-products", { expire: 0 });
  }
  if (/^\/categories(?:\/|$)/.test(normalizedPath)) {
    revalidateTag("public-categories", { expire: 0 });
  }
  if (
    /^\/stock-movements(?:\/|$)/.test(normalizedPath) ||
    /^\/purchase-orders\/[^/]+\/receive(?:\/|$)/.test(normalizedPath) ||
    (normalizedPath === "/orders" && method === "POST") ||
    (/^\/orders\/[^/]+\/status(?:\/|$)/.test(normalizedPath) && method === "PATCH")
  ) {
    revalidateTag("public-products", { expire: 0 });
  }
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

type RefreshResult =
  | { kind: "success"; tokens: Tokens }
  | { kind: "invalid" }
  | { kind: "unavailable" };

const refreshRequests = new Map<string, Promise<RefreshResult>>();

async function refreshTokens(refreshToken: string): Promise<RefreshResult> {
  let res: Response;
  try {
    res = await fetch(
      `${getBackendApiBaseUrl()}/auth/refresh`,
      withBackendTimeout({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }),
    );
  } catch {
    return { kind: "unavailable" };
  }

  if (res.status === 401 || res.status === 403) {
    return { kind: "invalid" };
  }
  if (!res.ok) return { kind: "unavailable" };

  const data = await res.json().catch(() => null);
  if (!data?.accessToken || !data?.refreshToken) {
    return { kind: "unavailable" };
  }
  return {
    kind: "success",
    tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken },
  };
}

function refreshTokensOnce(refreshToken: string): Promise<RefreshResult> {
  const existingRequest = refreshRequests.get(refreshToken);
  if (existingRequest) return existingRequest;

  const request = refreshTokens(refreshToken).finally(() => {
    refreshRequests.delete(refreshToken);
  });
  refreshRequests.set(refreshToken, request);
  return request;
}

function serviceUnavailableResponse() {
  return new Response(
    JSON.stringify({ message: "Authentication service temporarily unavailable" }),
    { status: 503, headers: { "Content-Type": "application/json" } },
  );
}

export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return { res: null, unauthorized: true as const };
  }

  const callBackend = async (token: string) => {
    const response = await fetch(
      `${getBackendApiBaseUrl()}${path}`,
      withBackendTimeout({
        ...init,
        headers: {
          ...(init.headers ?? {}),
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    revalidatePublicDataForMutation(path, init.method ?? "GET", response);
    return response;
  };

  if (accessToken) {
    const res = await callBackend(accessToken);
    if (res.status !== 401) {
      return { res, unauthorized: false as const };
    }
  }

  if (!refreshToken) {
    return { res: null, unauthorized: true as const };
  }

  const refreshResult = await refreshTokensOnce(refreshToken);
  if (refreshResult.kind === "unavailable") {
    return { res: serviceUnavailableResponse(), unauthorized: false as const };
  }
  if (refreshResult.kind === "invalid") {
    // A parallel request may already have rotated this token and returned new
    // cookies. Do not let this stale response delete those newer cookies.
    return { res: null, unauthorized: true as const };
  }

  cookieStore.set("accessToken", refreshResult.tokens.accessToken, COOKIE_OPTS);
  cookieStore.set("refreshToken", refreshResult.tokens.refreshToken, COOKIE_OPTS);

  const res = await callBackend(refreshResult.tokens.accessToken);
  return { res, unauthorized: false as const };
}

export async function fetchOptionalAuth(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const callBackend = (token?: string) =>
    fetch(
      `${getBackendApiBaseUrl()}${path}`,
      withBackendTimeout({
        ...init,
        headers: {
          ...(init.headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }),
    );

  if (!accessToken && !refreshToken) {
    return callBackend();
  }

  if (accessToken) {
    const res = await callBackend(accessToken);
    if (res.status !== 401) {
      return res;
    }
  }

  if (!refreshToken) {
    return callBackend();
  }

  const refreshResult = await refreshTokensOnce(refreshToken);
  if (refreshResult.kind === "unavailable") {
    return serviceUnavailableResponse();
  }
  if (refreshResult.kind === "invalid") {
    // Keep concurrent successful refresh responses from being overwritten by
    // a stale request's cookie deletion. Explicit logout clears both cookies.
    return callBackend();
  }

  cookieStore.set("accessToken", refreshResult.tokens.accessToken, COOKIE_OPTS);
  cookieStore.set("refreshToken", refreshResult.tokens.refreshToken, COOKIE_OPTS);

  return callBackend(refreshResult.tokens.accessToken);
}
