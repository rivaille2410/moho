import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

interface BulkDeleteResponse {
  deletedCount: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  PRODUCTS_NOT_FOUND: "Một số sản phẩm không tồn tại.",
};

async function bulkDeleteProducts(ids: string[]): Promise<BulkDeleteResponse> {
  const res = await fetch("/api/products/bulk", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message =
      (error?.code && ERROR_MESSAGES[error.code]) ??
      error?.message ??
      "Không thể xoá sản phẩm";
    throw new Error(message);
  }

  return res.json();
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteProducts,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: `Đã xoá ${data.deletedCount} sản phẩm`,
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
