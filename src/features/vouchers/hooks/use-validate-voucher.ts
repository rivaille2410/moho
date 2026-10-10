import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api-error";
import { ValidateVoucherPayload, VoucherValidationResult } from "@/types/voucher";
import { vouchersApi } from "../api/vouchers-api";

const ERROR_MESSAGES: Record<string, string> = {
  VOUCHER_NOT_ACTIVE: "Voucher hiện không hoạt động.",
  VOUCHER_NOT_IN_DATE_RANGE: "Voucher không còn hiệu lực.",
  VOUCHER_DEPLETED: "Voucher đã hết lượt sử dụng.",
  VOUCHER_USER_LIMIT_REACHED: "Bạn đã sử dụng hết lượt cho voucher này.",
  VOUCHER_MIN_ORDER_NOT_MET: "Đơn hàng chưa đạt giá trị tối thiểu để áp mã.",
  VOUCHER_NOT_APPLICABLE: "Voucher không áp dụng cho sản phẩm trong giỏ hàng.",
};

export function useValidateVoucher() {
  return useMutation<VoucherValidationResult, Error, ValidateVoucherPayload>({
    mutationFn: (input) => vouchersApi.validate(input),
    onError: (error) => {
      const message =
        (error instanceof ApiError && error.code && ERROR_MESSAGES[error.code]) ||
        error.message ||
        "Mã giảm giá không hợp lệ";
      toast.add({
        type: "error",
        description: message,
        priority: "high",
      });
    },
  });
}
