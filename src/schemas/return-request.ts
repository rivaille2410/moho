import { z } from "zod";

export const rejectReturnRequestSchema = z.object({
  rejectReason: z
    .string()
    .min(5, "Lý do từ chối phải có ít nhất 5 ký tự")
    .max(1000, "Lý do từ chối tối đa 1000 ký tự"),
});

export type RejectReturnRequestFormValues = z.infer<
  typeof rejectReturnRequestSchema
>;

export const processRefundSchema = z
  .object({
    refundMethod: z.enum(["BANK_TRANSFER", "ORIGINAL_PAYMENT_METHOD"]),
    refundBankName: z.string().optional(),
    refundBankAccountNumber: z.string().optional(),
    refundBankAccountHolder: z.string().optional(),
  })
  .refine(
    (data) =>
      data.refundMethod !== "BANK_TRANSFER" ||
      (data.refundBankName &&
        data.refundBankAccountNumber &&
        data.refundBankAccountHolder),
    {
      message: "Vui lòng nhập đầy đủ thông tin ngân hàng",
      path: ["refundBankAccountNumber"],
    },
  );

export type ProcessRefundFormValues = z.infer<typeof processRefundSchema>;
