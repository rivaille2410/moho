import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

interface BulkDeleteResponse {
  deletedCount: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_DELETE_MAIN_WAREHOUSE:
    "Vui lòng đặt kho khác làm kho chính trước khi xoá.",
  WAREHOUSE_HAS_OPEN_PURCHASE_ORDERS:
    "Một số kho hàng đang có đơn nhập hàng chưa hoàn tất.",
};

async function bulkDeleteWarehouses(
  ids: string[],
): Promise<BulkDeleteResponse> {
  const res = await fetch("/api/warehouses/bulk-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá kho hàng";
    throw new Error(message);
  }

  return res.json();
}

export function useBulkDeleteWarehouses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteWarehouses,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: `Đã xoá ${data.deletedCount} kho hàng`,
      });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
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
