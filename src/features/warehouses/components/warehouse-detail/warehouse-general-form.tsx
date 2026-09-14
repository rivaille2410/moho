"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  warehouseSchema,
  type WarehouseFormValues,
  buildDefaultWarehouseValues,
} from "@/schemas/warehouse";
import { type Warehouse } from "@/types/warehouse";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useProvinces } from "@/features/address/hooks/use-provinces";
import { useProvinceWards } from "@/features/address/hooks/use-province-wards";
import { useUpdateWarehouse } from "@/features/warehouses/hooks/use-update-warehouse";

interface Props {
  warehouse: Warehouse;
}

export function WarehouseGeneralForm({ warehouse }: Props) {
  const updateWarehouse = useUpdateWarehouse();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: buildDefaultWarehouseValues(warehouse),
  });

  useEffect(() => {
    form.reset(buildDefaultWarehouseValues(warehouse));
  }, [warehouse.id, warehouse.updatedAt]);

  const provinceCode = form.watch("provinceCode");
  const wardCode = form.watch("wardCode");
  const isMain = form.watch("isMain");

  const { data: provinces } = useProvinces();
  const { data: wards, isFetching: isWardsFetching } =
    useProvinceWards(provinceCode);

  const provinceItems = (provinces ?? []).map((p) => ({
    label: p.name,
    value: String(p.code),
  }));
  const wardItems = (wards ?? []).map((w) => ({
    label: w.name,
    value: String(w.code),
  }));

  const onSubmit = (values: WarehouseFormValues) => {
    updateWarehouse.mutate({
      id: warehouse.id,
      input: values,
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>
            Tên kho hàng <span className="text-destructive">*</span>
          </FieldLabel>
          <Input placeholder="Nhập tên kho hàng" {...form.register("name")} />
          {form.formState.errors.name && (
            <FieldError>{form.formState.errors.name.message}</FieldError>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Tỉnh / Thành phố</FieldLabel>
            <Select
              items={provinceItems}
              value={provinceCode ? String(provinceCode) : null}
              onValueChange={(value) => {
                form.setValue(
                  "provinceCode",
                  value ? Number(value) : undefined,
                  { shouldValidate: true },
                );
                form.setValue("wardCode", undefined);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                {provinceItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Phường / Xã</FieldLabel>
            <Select
              items={wardItems}
              value={wardCode ? String(wardCode) : null}
              onValueChange={(value) =>
                form.setValue("wardCode", value ? Number(value) : undefined, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !provinceCode
                      ? "Chọn tỉnh/thành phố trước"
                      : isWardsFetching
                        ? "Đang tải..."
                        : "Chọn phường/xã"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {wardItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel>Địa chỉ cụ thể</FieldLabel>
          <Input
            placeholder="Số nhà, tên đường..."
            {...form.register("addressDetail")}
          />
          {form.formState.errors.addressDetail && (
            <FieldError>
              {form.formState.errors.addressDetail.message}
            </FieldError>
          )}
        </Field>

        <Field orientation="horizontal">
          <div className="flex-1">
            <FieldLabel>Kho chính</FieldLabel>
            <FieldDescription>
              Đơn hàng và nhập kho mặc định sẽ ưu tiên kho này.
            </FieldDescription>
          </div>
          <Switch
            checked={isMain}
            onCheckedChange={(checked) =>
              form.setValue("isMain", checked, { shouldValidate: true })
            }
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateWarehouse.isPending}>
          {updateWarehouse.isPending && <Spinner className="size-4" />}
          {updateWarehouse.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
