import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

export interface ExportCategoriesInput {
  search?: string;
  parentId?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  EXPORT_TOO_LARGE:
    "Danh sách quá lớn để xuất file. Vui lòng lọc bớt trước khi xuất.",
};

function buildQueryString(input: ExportCategoriesInput) {
  const query = new URLSearchParams();
  if (input.search) query.set("search", input.search);
  if (input.parentId) query.set("parentId", input.parentId);
  return query.toString();
}

async function exportCategories(input: ExportCategoriesInput) {
  const query = buildQueryString(input);
  const res = await fetch(`/api/categories/export?${query}`, {
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
  const filename = filenameMatch?.[1] ?? `categories-${Date.now()}.xlsx`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function useExportCategories() {
  return useMutation({
    mutationFn: exportCategories,
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
