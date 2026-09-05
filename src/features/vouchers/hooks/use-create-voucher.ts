import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { CreateVoucherPayload, Voucher } from "@/types/voucher";

const ERROR_MESSAGES: Record<string, string> = {
  VOUCHER_CODE_ALREADY_IN_USE: "Mã voucher này đã được sử dụng.",
  CATEGORY_IDS_REQUIRED: "Vui lòng chọn danh mục áp dụng.",
  PRODUCT_IDS_REQUIRED: "Vui lòng chọn sản phẩm áp dụng.",
  INVALID_DATE_RANGE: "Ngày bắt đầu phải trước ngày kết thúc.",
};

async function createVoucher(input: CreateVoucherPayload): Promise<Voucher> {
  const res = await fetch("/api/vouchers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo voucher";
    throw new Error(message);
  }
  return data;
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo voucher mới" });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
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
