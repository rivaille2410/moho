"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import {
  supplierSchema,
  SupplierFormValues,
  buildDefaultSupplierValues,
} from "@/schemas/supplier";
import { type CreateSupplierInput } from "@/types/supplier";

import { useProvinces } from "@/features/address/hooks/use-provinces";
import { useProvinceWards } from "@/features/address/hooks/use-province-wards";
import { useSupplier } from "@/features/suppliers/hooks/use-supplier";
import { useCreateSupplier } from "@/features/suppliers/hooks/use-create-supplier";
import { useUpdateSupplier } from "@/features/suppliers/hooks/use-update-supplier";

interface SupplierFormDialogProps {
  supplierId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierFormDialog({
  supplierId,
  open,
  onOpenChange,
}: SupplierFormDialogProps) {
  const isEditing = !!supplierId;

  const {
    data: supplier,
    isLoading: isLoadingSupplier,
    isError: isSupplierError,
  } = useSupplier(supplierId ?? "");

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const isPending = createSupplier.isPending || updateSupplier.isPending;
  const isSaveDisabled = isPending || (isEditing && isLoadingSupplier);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: buildDefaultSupplierValues(),
  });

  const provinceCode = form.watch("provinceCode");

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: wards, isLoading: isLoadingWards } =
    useProvinceWards(provinceCode);

  useEffect(() => {
    if (!open) return;
    if (isEditing && !supplier) return;

    form.reset(
      buildDefaultSupplierValues(
        supplier
          ? {
              name: supplier.name,
              contactName: supplier.contactName ?? "",
              phone: supplier.phone?.replace(/^(\+84|0)/, "") ?? "",
              email: supplier.email ?? "",
              note: supplier.note ?? "",
              addressDetail: supplier.addressDetail ?? "",
              provinceCode: supplier.provinceCode ?? undefined,
              wardCode: supplier.wardCode ?? undefined,
            }
          : undefined,
      ),
    );
  }, [open, isEditing, supplier]);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const onSubmit = (values: SupplierFormValues) => {
    const payload: CreateSupplierInput = {
      name: values.name,
      contactName: values.contactName,
      phone: values.phone ? `+84${values.phone}` : undefined,
      email: values.email,
      addressDetail: values.addressDetail || undefined,
      provinceCode: values.provinceCode,
      wardCode: values.wardCode,
      note: values.note,
    };

    if (isEditing && supplierId) {
      updateSupplier.mutate(
        { id: supplierId, input: payload },
        { onSuccess: () => handleOpenChange(false) },
      );
    } else {
      createSupplier.mutate(payload, {
        onSuccess: () => handleOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col md:min-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin nhà cung cấp."
              : "Nhập thông tin nhà cung cấp mới."}
          </DialogDescription>
        </DialogHeader>

        {isEditing && isSupplierError && (
          <p className="text-sm text-destructive">
            Không thể tải thông tin nhà cung cấp. Vui lòng đóng và thử lại.
          </p>
        )}

        {isEditing && isLoadingSupplier ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-1">
            <FieldGroup>
              <Field>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </Field>
                <Field>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </Field>
              </div>

              <Field>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </Field>
                <Field>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </Field>
              </div>

              <Field>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </Field>

              <Field>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-16 w-full" />
              </Field>
            </FieldGroup>
          </div>
        ) : (
          <form
            id="supplier-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-1"
          >
            <FieldGroup>
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

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Người liên hệ</FieldLabel>
                  <Input
                    placeholder="Nhập tên người liên hệ"
                    {...form.register("contactName")}
                  />
                  {form.formState.errors.contactName && (
                    <FieldError>
                      {form.formState.errors.contactName.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Số điện thoại</FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r px-3 text-sm text-muted-foreground">
                      +84
                    </span>
                    <Controller
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          inputMode="numeric"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const digitsOnly = e.target.value
                              .replace(/\D/g, "")
                              .replace(/^0+/, "");
                            field.onChange(digitsOnly.slice(0, 9));
                          }}
                          placeholder="Nhập số điện thoại"
                          className="pl-14"
                        />
                      )}
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <FieldError>
                      {form.formState.errors.phone.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Tỉnh/Thành phố</FieldLabel>
                  <Controller
                    control={form.control}
                    name="provinceCode"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                          field.onChange(value ? Number(value) : undefined);
                          form.setValue("wardCode", undefined);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {(value: string) => {
                              if (!value) {
                                return isLoadingProvinces
                                  ? "Đang tải..."
                                  : "Chọn tỉnh/thành";
                              }
                              return (
                                provinces?.find((p) => String(p.code) === value)
                                  ?.name ?? value
                              );
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {provinces?.map((province) => (
                            <SelectItem
                              key={province.code}
                              value={String(province.code)}
                            >
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel>Phường/Xã</FieldLabel>
                  <Controller
                    control={form.control}
                    name="wardCode"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : undefined)
                        }
                        disabled={!provinceCode}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {(value: string) => {
                              if (!value) {
                                return isLoadingWards
                                  ? "Đang tải..."
                                  : "Chọn phường/xã";
                              }
                              return (
                                wards?.find((w) => String(w.code) === value)
                                  ?.name ?? value
                              );
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {wards?.map((ward) => (
                            <SelectItem
                              key={ward.code}
                              value={String(ward.code)}
                            >
                              {ward.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Địa chỉ cụ thể</FieldLabel>
                <Input
                  placeholder="Nhập số nhà, tên đường..."
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
                  rows={2}
                  placeholder="Nhập ghi chú thêm về nhà cung cấp"
                  {...form.register("note")}
                />
                {form.formState.errors.note && (
                  <FieldError>{form.formState.errors.note.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </form>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button type="submit" form="supplier-form" disabled={isSaveDisabled}>
            {isPending && <Spinner className="size-4" />}
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
