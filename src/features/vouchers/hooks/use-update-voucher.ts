import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { UpdateVoucherPayload, Voucher } from "@/types/voucher";

const ERROR_MESSAGES: Record<string, string> = {
  VOUCHER_CODE_ALREADY_IN_USE: "Mã voucher này đã được sử dụng.",
  CATEGORY_IDS_REQUIRED: "Vui lòng chọn danh mục áp dụng.",
  PRODUCT_IDS_REQUIRED: "Vui lòng chọn sản phẩm áp dụng.",
  INVALID_DATE_RANGE: "Ngày bắt đầu phải trước ngày kết thúc.",
};

interface UpdateVoucherInput {
  id: string;
  payload: UpdateVoucherPayload;
}

async function updateVoucher({
  id,
  payload,
}: UpdateVoucherInput): Promise<Voucher> {
  const res = await fetch(`/api/vouchers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật voucher";
    throw new Error(message);
  }
  return data;
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVoucher,
    onSuccess: (data, variables) => {
      toast.add({ type: "success", description: "Đã cập nhật voucher" });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      queryClient.setQueryData(["vouchers", variables.id], data);
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
