import { toast } from "@/components/ui/toast";

type AuthRequestOptions = {
  url: string;
  body?: unknown;
  method?: string;
  successMessage?: string;
  defaultErrorMessage?: string;
  errorMessages?: Record<string, string>;
};

type AuthRequestResult<T> = { ok: true; data: T } | { ok: false };

export async function authRequest<T = unknown>({
  url,
  body,
  successMessage,
  method = "POST",
  errorMessages = {},
  defaultErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại.",
}: AuthRequestOptions): Promise<AuthRequestResult<T>> {
  try {
    const isFormData = body instanceof FormData;

    const res = await fetch(url, {
      method,
      headers:
        body && !isFormData
          ? { "Content-Type": "application/json" }
          : undefined,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      const message =
        (error?.code && errorMessages[error.code]) ??
        error?.message ??
        defaultErrorMessage;

      toast.add({ type: "error", description: message, priority: "high" });
      return { ok: false };
    }

    const data = (await res.json().catch(() => null)) as T;

    if (successMessage) {
      toast.add({ type: "success", description: successMessage });
    }

    return { ok: true, data };
  } catch {
    toast.add({
      type: "error",
      description: defaultErrorMessage,
      priority: "high",
    });
    return { ok: false };
  }
}
