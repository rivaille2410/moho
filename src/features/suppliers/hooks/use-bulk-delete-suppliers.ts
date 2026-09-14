import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

interface BulkDeleteResponse {
  deletedCount: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  SUPPLIER_HAS_OPEN_PURCHASE_ORDERS:
    "Một số nhà cung cấp đang có đơn nhập hàng chưa hoàn tất.",
};

async function bulkDeleteSuppliers(ids: string[]): Promise<BulkDeleteResponse> {
  const res = await fetch("/api/suppliers/bulk-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá nhà cung cấp";
    throw new Error(message);
  }

  return res.json();
}

export function useBulkDeleteSuppliers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteSuppliers,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: `Đã xoá ${data.deletedCount} nhà cung cấp`,
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
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
