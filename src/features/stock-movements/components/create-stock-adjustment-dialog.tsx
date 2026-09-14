"use client";

import * as React from "react";

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
import { Label } from "@/components/ui/label";
import {
  VariantCombobox,
  type VariantSelection,
} from "@/components/shared/variant-combobox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { type CreateStockAdjustmentInput } from "@/types/stock-movement";

import { useWarehouses } from "@/features/warehouses/hooks/use-warehouses";
import { useCreateStockAdjustment } from "@/features/stock-movements/hooks/use-create-stock-adjustment";

interface CreateStockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AdjustmentFormState {
  variantId: string;
  variantLabel?: string;
  warehouseId: string;
  delta: string;
  note: string;
}

const emptyForm: AdjustmentFormState = {
  variantId: "",
  variantLabel: undefined,
  warehouseId: "",
  delta: "",
  note: "",
};

export function CreateStockAdjustmentDialog({
  open,
  onOpenChange,
}: CreateStockAdjustmentDialogProps) {
  const [form, setForm] = React.useState<AdjustmentFormState>(emptyForm);

  const { data: warehouses } = useWarehouses();
  const createAdjustment = useCreateStockAdjustment();

  React.useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const selectVariant = (option: VariantSelection) => {
    setForm((prev) => ({
      ...prev,
      variantId: option.variantId,
      variantLabel: option.variantLabel,
    }));
  };

  const delta = Number(form.delta);
  const isValid =
    form.variantId.trim() &&
    form.warehouseId.trim() &&
    form.delta.trim() &&
    !Number.isNaN(delta) &&
    delta !== 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const payload: CreateStockAdjustmentInput = {
      variantId: form.variantId.trim(),
      warehouseId: form.warehouseId.trim(),
      delta,
      note: form.note.trim() || undefined,
    };

    createAdjustment.mutate(payload, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-xl">
        <DialogHeader>
          <DialogTitle>Điều chỉnh tồn kho</DialogTitle>
          <DialogDescription>
            Nhập số dương để tăng tồn kho, số âm để giảm tồn kho.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Sản phẩm <span className="text-destructive">*</span>
            </Label>
            <VariantCombobox
              value={form.variantId}
              valueLabel={form.variantLabel}
              onSelect={selectVariant}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Kho hàng <span className="text-destructive">*</span>
            </Label>
            <Select
              items={(warehouses ?? []).map((w) => ({
                label: w.name,
                value: w.id,
              }))}
              value={form.warehouseId}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, warehouseId: value ?? "" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn kho hàng" />
              </SelectTrigger>
              <SelectContent>
                {(warehouses ?? []).map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Số lượng điều chỉnh <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={form.delta}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, delta: e.target.value }))
              }
              placeholder="Ví dụ: -3 hoặc 10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={form.note}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, note: e.target.value }))
              }
              placeholder="Kiểm kê cuối tháng, lệch 3 sản phẩm..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createAdjustment.isPending || !isValid}
          >
            {createAdjustment.isPending && <Spinner className="size-4" />}
            {createAdjustment.isPending ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
