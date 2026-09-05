import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import {
  ValidateVoucherPayload,
  VoucherValidationResult,
} from "@/types/voucher";

const ERROR_MESSAGES: Record<string, string> = {
  VOUCHER_NOT_ACTIVE: "Voucher hiện không hoạt động.",
  VOUCHER_NOT_IN_DATE_RANGE: "Voucher không còn hiệu lực.",
  VOUCHER_DEPLETED: "Voucher đã hết lượt sử dụng.",
  VOUCHER_USER_LIMIT_REACHED: "Bạn đã sử dụng hết lượt cho voucher này.",
  VOUCHER_MIN_ORDER_NOT_MET: "Đơn hàng chưa đạt giá trị tối thiểu để áp mã.",
  VOUCHER_NOT_APPLICABLE: "Voucher không áp dụng cho sản phẩm trong giỏ hàng.",
};

async function validateVoucher(
  input: ValidateVoucherPayload,
): Promise<VoucherValidationResult> {
  const res = await fetch("/api/vouchers/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Mã giảm giá không hợp lệ";
    throw new Error(message);
  }
  return data;
}

export function useValidateVoucher() {
  return useMutation({
    mutationFn: validateVoucher,
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
