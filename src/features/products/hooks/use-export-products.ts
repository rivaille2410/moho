import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { type ProductStatus } from "@/types/product";

export interface ExportProductsInput {
  search?: string;
  status?: ProductStatus;
  categoryId?: string;
  outOfStock?: boolean;
}

const ERROR_MESSAGES: Record<string, string> = {
  EXPORT_TOO_LARGE:
    "Danh sách quá lớn để xuất file. Vui lòng lọc bớt trước khi xuất.",
};

function buildQueryString(input: ExportProductsInput) {
  const query = new URLSearchParams();
  if (input.search) query.set("search", input.search);
  if (input.status) query.set("status", input.status);
  if (input.categoryId) query.set("categoryId", input.categoryId);
  if (input.outOfStock !== undefined)
    query.set("outOfStock", String(input.outOfStock));
  return query.toString();
}

async function exportProducts(input: ExportProductsInput) {
  const query = buildQueryString(input);
  const res = await fetch(`/api/products/export?${query}`, {
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
  const filename = filenameMatch?.[1] ?? `products-${Date.now()}.xlsx`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function useExportProducts() {
  return useMutation({
    mutationFn: exportProducts,
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
