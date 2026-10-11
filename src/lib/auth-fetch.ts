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

async function refreshTokens(refreshToken: string): Promise<Tokens | null> {
  const res = await fetch(
    `${getBackendApiBaseUrl()}/auth/refresh`,
    withBackendTimeout({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }),
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.accessToken || !data?.refreshToken) return null;

  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
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

  const newTokens = await refreshTokens(refreshToken);
  if (!newTokens) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { res: null, unauthorized: true as const };
  }

  cookieStore.set("accessToken", newTokens.accessToken, COOKIE_OPTS);
  cookieStore.set("refreshToken", newTokens.refreshToken, COOKIE_OPTS);

  const res = await callBackend(newTokens.accessToken);
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

  const newTokens = await refreshTokens(refreshToken);
  if (!newTokens) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return callBackend();
  }

  cookieStore.set("accessToken", newTokens.accessToken, COOKIE_OPTS);
  cookieStore.set("refreshToken", newTokens.refreshToken, COOKIE_OPTS);

  return callBackend(newTokens.accessToken);
}
