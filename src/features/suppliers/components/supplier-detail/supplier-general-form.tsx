"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  supplierSchema,
  type SupplierFormValues,
  buildDefaultSupplierValues,
} from "@/schemas/supplier";
import { type Supplier } from "@/types/supplier";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
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
import { Textarea } from "@/components/ui/textarea";

import { useProvinces } from "@/features/addresses/hooks/use-provinces";
import { useProvinceWards } from "@/features/addresses/hooks/use-province-wards";
import { useUpdateSupplier } from "@/features/suppliers/hooks/use-update-supplier";

interface Props {
  supplier: Supplier;
}

export function SupplierGeneralForm({ supplier }: Props) {
  const updateSupplier = useUpdateSupplier();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: buildDefaultSupplierValues(supplier),
  });

  useEffect(() => {
    form.reset(buildDefaultSupplierValues(supplier));
  }, [supplier.id, supplier.updatedAt]);

  const provinceCode = form.watch("provinceCode");
  const wardCode = form.watch("wardCode");

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

  const onSubmit = (values: SupplierFormValues) => {
    updateSupplier.mutate({
      id: supplier.id,
      input: values,
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
            <FieldLabel>
              Tên nhà cung cấp <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="Nhập tên nhà cung cấp"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Người liên hệ</FieldLabel>
            <Input
              placeholder="Tên người liên hệ"
              {...form.register("contactName")}
            />
            {form.formState.errors.contactName && (
              <FieldError>
                {form.formState.errors.contactName.message}
              </FieldError>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Số điện thoại</FieldLabel>
            <Input placeholder="09xxxxxxxx" {...form.register("phone")} />
            {form.formState.errors.phone && (
              <FieldError>{form.formState.errors.phone.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input placeholder="Email" {...form.register("email")} />
            {form.formState.errors.email && (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            )}
          </Field>
        </div>

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

        <Field>
          <FieldLabel>Ghi chú</FieldLabel>
          <Textarea
            rows={3}
            placeholder="Ghi chú thêm về nhà cung cấp"
            {...form.register("note")}
          />
          {form.formState.errors.note && (
            <FieldError>{form.formState.errors.note.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateSupplier.isPending}>
          {updateSupplier.isPending && <Spinner className="size-4" />}
          {updateSupplier.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
