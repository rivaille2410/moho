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

import {
  type ManualAdjustmentType,
  type CreateStockAdjustmentInput,
} from "@/types/stock-movement";

import { useWarehouses } from "@/features/warehouses/hooks/use-warehouses";
import { useCreateStockAdjustment } from "@/features/stock-movements/hooks/use-create-stock-adjustment";

interface CreateStockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AdjustmentFormState {
  productId: string;
  variantId: string | null;
  variantLabel?: string;
  warehouseId: string;
  type: ManualAdjustmentType;
  delta: string;
  note: string;
}

const ADJUSTMENT_TYPE_OPTIONS: {
  label: string;
  value: ManualAdjustmentType;
}[] = [
  { label: "Kiểm kê / điều chỉnh", value: "ADJUSTMENT" },
  { label: "Hàng hỏng / hao hụt", value: "DAMAGED_OUT" },
];

const emptyForm: AdjustmentFormState = {
  productId: "",
  variantId: null,
  variantLabel: undefined,
  warehouseId: "",
  type: "ADJUSTMENT",
  delta: "",
  note: "",
};

export function CreateStockAdjustmentDialog({
  open,
  onOpenChange,
}: CreateStockAdjustmentDialogProps) {
  const [form, setForm] = React.useState<AdjustmentFormState>(emptyForm);

  const { data: warehouses, isLoading: isWarehousesLoading } = useWarehouses();
  const hasWarehouses = (warehouses?.length ?? 0) > 0;
  const createAdjustment = useCreateStockAdjustment();

  React.useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const selectVariant = (option: VariantSelection) => {
    setForm((prev) => ({
      ...prev,
      productId: option.productId,
      variantId: option.variantId,
      variantLabel: option.variantLabel,
    }));
  };

  const delta = Number(form.delta);
  const isDamaged = form.type === "DAMAGED_OUT";
  const isDeltaValid =
    form.delta.trim() !== "" &&
    Number.isInteger(delta) &&
    delta !== 0 &&
    (!isDamaged || delta < 0);

  const isValid =
    form.productId.trim() && form.warehouseId.trim() && isDeltaValid;

  const handleSubmit = () => {
    if (!isValid || createAdjustment.isPending) return;

    const payload: CreateStockAdjustmentInput = {
      productId: form.productId.trim(),
      variantId: form.variantId ?? undefined,
      warehouseId: form.warehouseId.trim(),
      delta,
      type: form.type,
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
              allowOutOfStock
              value={form.variantId ?? form.productId}
              valueLabel={form.variantLabel}
              onSelect={selectVariant}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Kho hàng <span className="text-destructive">*</span>
            </Label>

            {isWarehousesLoading ? (
              <div className="text-muted-foreground flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
                <Spinner className="size-4" />
                Đang tải danh sách kho...
              </div>
            ) : !hasWarehouses ? (
              <div className="text-muted-foreground rounded-md border border-dashed px-3 py-2 text-sm">
                Chưa có kho hàng nào. Vui lòng tạo kho hàng trước khi điều chỉnh
                tồn kho.
              </div>
            ) : (
              <Select
                items={warehouses!.map((w) => ({
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
                  {warehouses!.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Loại điều chỉnh</Label>
            <Select
              items={ADJUSTMENT_TYPE_OPTIONS}
              value={form.type}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  type: (value as ManualAdjustmentType) ?? "ADJUSTMENT",
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại điều chỉnh" />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
              step={1}
              value={form.delta}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, delta: e.target.value }))
              }
              placeholder={isDamaged ? "Ví dụ: -3" : "Ví dụ: -3 hoặc 10"}
            />
            {isDamaged && form.delta.trim() !== "" && delta > 0 && (
              <p className="text-destructive text-sm">
                Hàng hỏng / hao hụt phải nhập số âm.
              </p>
            )}
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
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button
            type="button"
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
