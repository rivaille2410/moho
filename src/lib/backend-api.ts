const DEFAULT_UPSTREAM_TIMEOUT_MS = 60_000;

export function getBackendApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl =
    configuredUrl ??
    (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");
  const normalized = baseUrl.replace(/\/+$/, "");

  if (!normalized) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return normalized;
}

export function withBackendTimeout(
  init: RequestInit = {},
  additionalSignal?: AbortSignal,
): RequestInit {
  const configuredTimeout = Number(process.env.PUBLIC_API_TIMEOUT_MS);
  const timeoutMs =
    Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : DEFAULT_UPSTREAM_TIMEOUT_MS;
  const signals = [init.signal, additionalSignal].filter(
    (signal): signal is AbortSignal => signal !== null && signal !== undefined,
  );
  signals.push(AbortSignal.timeout(timeoutMs));

  return {
    ...init,
    signal: signals.length === 1 ? signals[0] : AbortSignal.any(signals),
  };
}
