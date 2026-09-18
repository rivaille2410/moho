"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import {
  rejectReturnRequestSchema,
  RejectReturnRequestFormValues,
} from "@/schemas/return-request";
import { ReturnRequestListItem } from "@/types/return-request";
import { useRejectReturnRequest } from "@/features/return-requests/hooks/use-reject-return-request";

interface RejectReturnRequestDialogProps {
  item: ReturnRequestListItem | null;
  onOpenChange: (open: boolean) => void;
}

export function RejectReturnRequestDialog({
  item,
  onOpenChange,
}: RejectReturnRequestDialogProps) {
  const rejectReturnRequest = useRejectReturnRequest();

  const form = useForm<RejectReturnRequestFormValues>({
    resolver: zodResolver(rejectReturnRequestSchema),
    defaultValues: { rejectReason: "" },
  });

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      form.reset();
      rejectReturnRequest.reset();
    }
  };

  const onSubmit = (values: RejectReturnRequestFormValues) => {
    if (!item) return;

    rejectReturnRequest.mutate(
      { id: item.id, input: values },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={!!item} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] md:min-w-lg">
        <DialogHeader>
          <DialogTitle>Từ chối yêu cầu đổi trả</DialogTitle>
          <DialogDescription>
            Yêu cầu <span className="font-medium">{item?.code}</span> sẽ bị từ
            chối. Vui lòng nêu rõ lý do để khách hàng được thông báo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel>Lý do từ chối</FieldLabel>
            <Textarea
              rows={4}
              placeholder="Ví dụ: Sản phẩm không có dấu hiệu lỗi như mô tả..."
              {...form.register("rejectReason")}
            />
            {form.formState.errors.rejectReason && (
              <FieldError>
                {form.formState.errors.rejectReason.message}
              </FieldError>
            )}
          </Field>

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
              variant="destructive"
              disabled={rejectReturnRequest.isPending}
            >
              {rejectReturnRequest.isPending && <Spinner className="size-4" />}
              {rejectReturnRequest.isPending
                ? "Đang từ chối..."
                : "Từ chối yêu cầu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
