import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ReturnRequest } from "@/types/return-request";

const ERROR_MESSAGES: Record<string, string> = {
  RETURN_ALREADY_FINALIZED: "Yêu cầu này đã được xử lý xong.",
  INVALID_RETURN_STATUS_TRANSITION: "Yêu cầu chưa được nhận hàng.",
  REFUND_PROOF_REQUIRED: "Vui lòng đính kèm ảnh chứng minh đã chuyển tiền.",
};

export type ProcessRefundInput = {
  refundMethod: "BANK_TRANSFER" | "ORIGINAL_PAYMENT_METHOD";
  refundBankName?: string;
  refundBankAccountNumber?: string;
  refundBankAccountHolder?: string;
  proofImage?: File;
};

function buildRefundFormData(payload: ProcessRefundInput) {
  const formData = new FormData();
  formData.append("refundMethod", payload.refundMethod);
  if (payload.refundBankName)
    formData.append("refundBankName", payload.refundBankName);
  if (payload.refundBankAccountNumber)
    formData.append("refundBankAccountNumber", payload.refundBankAccountNumber);
  if (payload.refundBankAccountHolder)
    formData.append("refundBankAccountHolder", payload.refundBankAccountHolder);
  if (payload.proofImage) formData.append("proofImage", payload.proofImage);
  return formData;
}

async function processReturnRefund({
  id,
  ...payload
}: ProcessRefundInput & { id: string }) {
  const res = await fetch(`/api/admin/return-requests/${id}/refund`, {
    method: "PATCH",
    body: buildRefundFormData(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể xử lý hoàn tiền";
    throw new Error(message);
  }
  return data as ReturnRequest;
}

export function useProcessReturnRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processReturnRefund,
    onSuccess: (data) => {
      toast.add({
        type: "success",
        description: "Đã xử lý hoàn tiền",
      });
      queryClient.invalidateQueries({ queryKey: ["return-requests"] });
      queryClient.invalidateQueries({ queryKey: ["return-requests", data.id] });
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
