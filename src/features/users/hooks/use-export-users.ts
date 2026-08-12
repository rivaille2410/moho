import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

export interface ExportUsersInput {
  search?: string;
  role?: string;
  banned?: boolean;
  emailVerified?: boolean;
}

const ERROR_MESSAGES: Record<string, string> = {};

function buildQueryString(input: ExportUsersInput) {
  const query = new URLSearchParams();
  if (input.search) query.set("search", input.search);
  if (input.role) query.set("role", input.role);
  if (input.banned !== undefined) query.set("banned", String(input.banned));
  if (input.emailVerified !== undefined)
    query.set("emailVerified", String(input.emailVerified));
  return query.toString();
}

async function exportUsers(input: ExportUsersInput) {
  const query = buildQueryString(input);
  const res = await fetch(`/api/users/export?${query}`, {
    method: "GET",
  });

  if (!res.ok) {
    let message = "Không thể xuất file Excel";
    try {
      const data = await res.json();
      message =
        (data?.code && ERROR_MESSAGES[data.code]) ?? data?.message ?? message;
    } catch {}
    throw new Error(message);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch?.[1] ?? `users-${Date.now()}.xlsx`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function useExportUsers() {
  return useMutation({
    mutationFn: exportUsers,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã xuất file Excel" });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
