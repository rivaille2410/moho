"use client";

import * as React from "react";

import { Plus, Trash2 } from "lucide-react";

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
import {
  VariantCombobox,
  type VariantSelection,
} from "@/components/shared/variant-combobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { CurrencyInput } from "@/components/ui/currency-input";

import { type CreatePurchaseOrderInput } from "@/types/purchase-order";

import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { useWarehouses } from "@/features/warehouses/hooks/use-warehouses";
import { useCreatePurchaseOrder } from "@/features/purchase-orders/hooks/use-create-purchase-order";

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ItemFormState {
  variantId: string;
  variantLabel?: string;
  quantityOrdered: number;
  unitCost: number;
}

const emptyItem: ItemFormState = {
  variantId: "",
  variantLabel: undefined,
  quantityOrdered: 1,
  unitCost: 0,
};

export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
}: CreatePurchaseOrderDialogProps) {
  const [supplierId, setSupplierId] = React.useState("");
  const [warehouseId, setWarehouseId] = React.useState("");
  const [expectedAt, setExpectedAt] = React.useState("");
  const [note, setNote] = React.useState("");
  const [items, setItems] = React.useState<ItemFormState[]>([{ ...emptyItem }]);

  const { data: suppliers } = useSuppliers({ limit: 100 });
  const { data: warehouses } = useWarehouses();
  const createPO = useCreatePurchaseOrder();

  React.useEffect(() => {
    if (open) {
      setSupplierId("");
      setWarehouseId("");
      setExpectedAt("");
      setNote("");
      setItems([{ ...emptyItem }]);
    }
  }, [open]);

  const updateItem = (index: number, patch: Partial<ItemFormState>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const selectVariant = (index: number, option: VariantSelection) => {
    updateItem(index, {
      variantId: option.variantId,
      variantLabel: option.variantLabel,
      unitCost: option.unitCost,
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid =
    !!supplierId &&
    !!warehouseId &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.variantId.trim() && item.quantityOrdered > 0 && item.unitCost >= 0,
    );

  const handleSubmit = () => {
    if (!isValid) return;

    const payload: CreatePurchaseOrderInput = {
      supplierId,
      warehouseId,
      note: note.trim() || undefined,
      expectedAt: expectedAt || undefined,
      items: items.map(({ variantId, quantityOrdered, unitCost }) => ({
        variantId,
        quantityOrdered,
        unitCost,
      })),
    };

    createPO.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn nhập hàng</DialogTitle>
          <DialogDescription>
            Chọn nhà cung cấp, kho hàng và danh sách sản phẩm cần nhập.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>
                Nhà cung cấp <span className="text-destructive">*</span>
              </Label>
              <Select
                items={(suppliers?.data ?? []).map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
                value={supplierId}
                onValueChange={(value) => setSupplierId(value ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {(suppliers?.data ?? []).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                value={warehouseId}
                onValueChange={(value) => setWarehouseId(value ?? "")}
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
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ngày dự kiến nhận</Label>
            <DatePicker value={expectedAt} onChange={setExpectedAt} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>
                Sản phẩm <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setItems((prev) => [...prev, { ...emptyItem }])}
              >
                <Plus className="size-3.5" />
                Thêm dòng
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item, index) => {
                const isDuplicate =
                  !!item.variantId &&
                  items.filter((i) => i.variantId === item.variantId).length >
                    1;

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-1 rounded-lg border p-2"
                  >
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Sản phẩm</Label>
                        <VariantCombobox
                          value={item.variantId}
                          valueLabel={item.variantLabel}
                          onSelect={(option) => selectVariant(index, option)}
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-24">
                        <Label className="text-xs">SL đặt</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantityOrdered}
                          onChange={(e) =>
                            updateItem(index, {
                              quantityOrdered: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-40">
                        <Label className="text-xs">Đơn giá</Label>
                        <CurrencyInput
                          value={item.unitCost}
                          onChange={(value) =>
                            updateItem(index, { unitCost: value ?? 0 })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        disabled={items.length === 1}
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    {isDuplicate && (
                      <p className="text-xs text-destructive">
                        Sản phẩm này đã được chọn ở dòng khác.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm cho đơn nhập hàng (tuỳ chọn)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPO.isPending || !isValid}
          >
            {createPO.isPending && <Spinner className="size-4" />}
            {createPO.isPending ? "Đang tạo..." : "Tạo đơn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
