"use client";

import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, User, Phone, Car, Barcode, Dices } from "lucide-react";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { RequiredMark } from "@/components/shared/required-mark";

import {
  shipmentInfoSchema,
  generateTrackingCode,
  normalizeShipmentInfo,
  ShipmentInfoFormValues,
  buildDefaultShipmentInfoValues,
} from "@/schemas/shipment";
import { type ShippableOrder } from "@/types/shipment";
import { useCreateShipment } from "../hooks/use-create-shipment";

import { OrderCombobox } from "./order-combobox";
import { OrderItemsList, type SelectedShipmentItem } from "./order-items-list";

const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export function CreateShipmentDialog() {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<ShippableOrder | undefined>(undefined);
  const [items, setItems] = useState<SelectedShipmentItem[]>([]);
  const [itemsError, setItemsError] = useState<string | undefined>(undefined);

  const createShipment = useCreateShipment();

  const form = useForm<ShipmentInfoFormValues>({
    resolver: zodResolver(shipmentInfoSchema),
    defaultValues: buildDefaultShipmentInfoValues(),
  });
  const { errors } = form.formState;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(buildDefaultShipmentInfoValues());
      setOrder(undefined);
      setItems([]);
      setItemsError(undefined);
    } else {
      createShipment.reset();
    }
  };

  const handleOrderChange = (next: ShippableOrder) => {
    setOrder(next);
    setItems(
      next.items.map((item) => ({
        orderItemId: item.orderItemId,
        quantity: item.remainingQuantity,
      })),
    );
    setItemsError(undefined);
  };

  const handleItemsChange = (next: SelectedShipmentItem[]) => {
    setItems(next);
    if (next.length > 0) setItemsError(undefined);
  };

  const onSubmit = (values: ShipmentInfoFormValues) => {
    if (!order) return;

    if (items.length === 0) {
      setItemsError("Chọn ít nhất 1 sản phẩm để giao");
      return;
    }
    setItemsError(undefined);

    createShipment.mutate(
      { ...normalizeShipmentInfo(values), orderId: order.id, items },
      { onSuccess: () => handleOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size={"lg"}>
            <Plus className="size-4" />
            <span className="hidden xl:inline">Tạo vận đơn</span>
          </Button>
        }
      />

      <DialogContent className="w-[95vw] min-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo vận đơn mới</DialogTitle>
          <DialogDescription>
            Chọn đơn hàng và sản phẩm cần giao trong vận đơn này.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>
                Đơn hàng
                <RequiredMark />
              </FieldLabel>
              <OrderCombobox value={order} onChange={handleOrderChange} />
            </Field>

            <Field>
              <FieldLabel>
                Sản phẩm trong vận đơn
                <RequiredMark />
              </FieldLabel>
              <OrderItemsList
                order={order}
                value={items}
                onChange={handleItemsChange}
              />
              {itemsError && <FieldError>{itemsError}</FieldError>}
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Tên tài xế</FieldLabel>
                <Input
                  startIcon={<User />}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...form.register("driverName")}
                />
                {errors.driverName && (
                  <FieldError>{errors.driverName.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>SĐT tài xế</FieldLabel>
                <Input
                  type="tel"
                  startIcon={<Phone />}
                  placeholder="Ví dụ: 0912345678"
                  {...form.register("driverPhone")}
                />
                {errors.driverPhone && (
                  <FieldError>{errors.driverPhone.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Biển số xe</FieldLabel>
                <Input
                  startIcon={<Car />}
                  placeholder="Ví dụ: 51A-123.45"
                  {...form.register("vehiclePlate")}
                />
                {errors.vehiclePlate && (
                  <FieldError>{errors.vehiclePlate.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Mã vận đơn</FieldLabel>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      startIcon={<Barcode />}
                      placeholder="Ví dụ: VD-260919-A7K2"
                      {...form.register("trackingCode")}
                    />
                  </div>
                  <Button
                    size="lg"
                    type="button"
                    variant="outline"
                    title="Tạo mã ngẫu nhiên"
                    onClick={() =>
                      form.setValue("trackingCode", generateTrackingCode(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Dices className="size-4" />
                  </Button>
                </div>
                {errors.trackingCode && (
                  <FieldError>{errors.trackingCode.message}</FieldError>
                )}
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel>Ngày giao dự kiến</FieldLabel>
                <Controller
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Chọn ngày giao"
                      disabled={isPastDate}
                    />
                  )}
                />
                {errors.scheduledAt && (
                  <FieldError>{errors.scheduledAt.message}</FieldError>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Ghi chú</FieldLabel>
              <Textarea
                placeholder="Ví dụ: Giao trong giờ hành chính, gọi trước 15 phút..."
                {...form.register("note")}
              />
              {errors.note && <FieldError>{errors.note.message}</FieldError>}
            </Field>
          </FieldGroup>

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
              disabled={!order || createShipment.isPending}
            >
              {createShipment.isPending && <Spinner className="size-4" />}
              {createShipment.isPending ? "Đang tạo..." : "Tạo vận đơn"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
