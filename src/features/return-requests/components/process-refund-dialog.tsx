"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Building2, User } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import {
  processRefundSchema,
  ProcessRefundFormValues,
} from "@/schemas/return-request";
import { ReturnRequestListItem } from "@/types/return-request";
import { useProcessRefund } from "@/features/return-requests/hooks/use-process-refund";

interface ProcessRefundDialogProps {
  item: ReturnRequestListItem | null;
  onOpenChange: (open: boolean) => void;
}

const refundMethodItems = [
  { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER" },
  {
    label: "Hoàn về phương thức thanh toán gốc",
    value: "ORIGINAL_PAYMENT_METHOD",
  },
];

function formatPrice(value: string | number) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

export function ProcessRefundDialog({
  item,
  onOpenChange,
}: ProcessRefundDialogProps) {
  const processRefund = useProcessRefund();

  const form = useForm<ProcessRefundFormValues>({
    resolver: zodResolver(processRefundSchema),
    defaultValues: {
      refundMethod: "ORIGINAL_PAYMENT_METHOD",
      refundBankName: "",
      refundBankAccountNumber: "",
      refundBankAccountHolder: "",
    },
  });

  const refundMethod = form.watch("refundMethod");

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      form.reset();
      processRefund.reset();
    }
  };

  const onSubmit = (values: ProcessRefundFormValues) => {
    if (!item) return;

    processRefund.mutate(
      { id: item.id, input: values },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={!!item} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] md:min-w-lg">
        <DialogHeader>
          <DialogTitle>Xử lý hoàn tiền</DialogTitle>
          <DialogDescription>
            Xác nhận hoàn{" "}
            <span className="font-medium text-foreground">
              {item && formatPrice(item.refundAmount)}
            </span>{" "}
            cho yêu cầu <span className="font-medium">{item?.code}</span>.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel>Phương thức hoàn tiền</FieldLabel>
            <Select
              items={refundMethodItems}
              value={refundMethod}
              onValueChange={(value: string | null) =>
                form.setValue(
                  "refundMethod",
                  (value ??
                    "ORIGINAL_PAYMENT_METHOD") as ProcessRefundFormValues["refundMethod"],
                  { shouldValidate: true },
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                {refundMethodItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {refundMethod === "BANK_TRANSFER" && (
            <>
              <Field>
                <FieldLabel>Ngân hàng</FieldLabel>
                <Input
                  startIcon={<Building2 />}
                  placeholder="Ví dụ: Vietcombank"
                  {...form.register("refundBankName")}
                />
              </Field>

              <Field>
                <FieldLabel>Số tài khoản</FieldLabel>
                <Input
                  startIcon={<Banknote />}
                  placeholder="Số tài khoản nhận hoàn tiền"
                  {...form.register("refundBankAccountNumber")}
                />
                {form.formState.errors.refundBankAccountNumber && (
                  <FieldError>
                    {form.formState.errors.refundBankAccountNumber.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Chủ tài khoản</FieldLabel>
                <Input
                  startIcon={<User />}
                  placeholder="Tên chủ tài khoản"
                  {...form.register("refundBankAccountHolder")}
                />
              </Field>
            </>
          )}

          <DialogFooter>
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button
              size={"lg"}
              type="submit"
              disabled={processRefund.isPending}
            >
              {processRefund.isPending && <Spinner className="size-4" />}
              {processRefund.isPending ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
