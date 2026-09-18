import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ReturnRequest,
  CreateReturnRequestInput,
} from "@/types/return-request";
import { toast } from "@/components/ui/toast";

const ERROR_MESSAGES: Record<string, string> = {
  ORDER_NOT_ELIGIBLE_FOR_RETURN:
    "Đơn hàng này chưa đủ điều kiện để yêu cầu trả hàng.",
  RETURN_QUANTITY_EXCEEDS_PURCHASED:
    "Số lượng yêu cầu trả vượt quá số lượng đã mua.",
  ORDER_ITEM_NOT_FOUND: "Một hoặc nhiều sản phẩm không thuộc đơn hàng này.",
};

async function createReturnRequest(input: CreateReturnRequestInput) {
  const res = await fetch("/api/return-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể gửi yêu cầu trả hàng";
    throw new Error(message);
  }
  return data as ReturnRequest;
}

export function useCreateReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Đã gửi yêu cầu trả hàng, chờ shop xác nhận",
      });
      queryClient.invalidateQueries({ queryKey: ["my-return-requests"] });
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
