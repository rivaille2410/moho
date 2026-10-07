"use client";

import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

import {
  shipmentInfoSchema,
  normalizeShipmentInfo,
  type ShipmentInfoFormValues,
  buildShipmentInfoValuesFromShipment,
} from "@/schemas/shipment";
import { type Shipment } from "@/types/shipment";
import { PhoneInput } from "@/components/shared/phone-input";
import { useUpdateShipment } from "@/features/shipments/hooks/use-update-shipment";

interface Props {
  shipment: Shipment;
}

export function ShipmentInfoForm({ shipment }: Props) {
  const updateShipment = useUpdateShipment();

  const form = useForm<ShipmentInfoFormValues>({
    resolver: zodResolver(shipmentInfoSchema),
    defaultValues: buildShipmentInfoValuesFromShipment(shipment),
  });

  useEffect(() => {
    form.reset(buildShipmentInfoValuesFromShipment(shipment));
  }, [shipment.id, shipment.updatedAt]);

  const isLocked =
    shipment.status === "DELIVERED" ||
    shipment.status === "CANCELLED" ||
    shipment.status === "FAILED";

  const onSubmit = (values: ShipmentInfoFormValues) => {
    updateShipment.mutate({
      id: shipment.id,
      input: normalizeShipmentInfo(values),
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Mã vận đơn</FieldLabel>
            <Input value={shipment.code} disabled readOnly />
          </Field>

          <Field>
            <FieldLabel>Ngày hẹn giao</FieldLabel>
            <Controller
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <DatePicker
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              )}
            />
            {form.formState.errors.scheduledAt && (
              <FieldError>
                {form.formState.errors.scheduledAt.message}
              </FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Tài xế</FieldLabel>
            <Input
              placeholder="Tên tài xế"
              disabled={isLocked}
              {...form.register("driverName")}
            />
            {form.formState.errors.driverName && (
              <FieldError>
                {form.formState.errors.driverName.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Số điện thoại tài xế</FieldLabel>
            <Controller
              control={form.control}
              name="driverPhone"
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLocked}
                  placeholder="Nhập số điện thoại"
                />
              )}
            />
            {form.formState.errors.driverPhone && (
              <FieldError>
                {form.formState.errors.driverPhone.message}
              </FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>Biển số xe</FieldLabel>
          <Input
            placeholder="VD: 51F-123.45"
            disabled={isLocked}
            {...form.register("vehiclePlate")}
          />
          {form.formState.errors.vehiclePlate && (
            <FieldError>
              {form.formState.errors.vehiclePlate.message}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Ghi chú</FieldLabel>
          <Textarea
            rows={3}
            placeholder="Ghi chú thêm về vận đơn"
            disabled={isLocked}
            {...form.register("note")}
          />
          {form.formState.errors.note && (
            <FieldError>{form.formState.errors.note.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      {!isLocked && (
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={updateShipment.isPending}>
            {updateShipment.isPending && <Spinner className="size-4" />}
            {updateShipment.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      )}
    </form>
  );
}
