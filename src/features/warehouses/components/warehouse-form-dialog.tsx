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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

import {
  warehouseSchema,
  WarehouseFormValues,
  buildDefaultWarehouseValues,
} from "@/schemas/warehouse";
import { type Warehouse, type CreateWarehouseInput } from "@/types/warehouse";

import { useProvinces } from "@/features/addresses/hooks/use-provinces";
import { useWarehouse } from "@/features/warehouses/hooks/use-warehouse";
import { useProvinceWards } from "@/features/addresses/hooks/use-province-wards";
import { useCreateWarehouse } from "@/features/warehouses/hooks/use-create-warehouse";
import { useUpdateWarehouse } from "@/features/warehouses/hooks/use-update-warehouse";

interface WarehouseFormDialogProps {
  warehouse: Warehouse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WarehouseFormDialog({
  warehouse,
  open,
  onOpenChange,
}: WarehouseFormDialogProps) {
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();

  const isEditing = !!warehouse;
  const isPending = createWarehouse.isPending || updateWarehouse.isPending;

  const { data: warehouseDetail, isFetching: isLoadingDetail } = useWarehouse(
    isEditing && open ? warehouse!.id : "",
  );

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: buildDefaultWarehouseValues(),
  });

  const provinceCode = form.watch("provinceCode");

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: wards, isLoading: isLoadingWards } =
    useProvinceWards(provinceCode);

  useEffect(() => {
    if (!open) return;

    if (!isEditing) {
      form.reset(buildDefaultWarehouseValues());
      return;
    }

    if (warehouseDetail) {
      form.reset(
        buildDefaultWarehouseValues({
          name: warehouseDetail.name,
          provinceCode: warehouseDetail.provinceCode ?? undefined,
          wardCode: warehouseDetail.wardCode ?? undefined,
          addressDetail: warehouseDetail.addressDetail ?? "",
          isMain: warehouseDetail.isMain,
        }),
      );
    }
  }, [open, isEditing, warehouseDetail, form]);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset(buildDefaultWarehouseValues());
    }
  };

  const onSubmit = (values: WarehouseFormValues) => {
    const province = provinces?.find((p) => p.code === values.provinceCode);
    const ward = wards?.find((w) => w.code === values.wardCode);

    const payload: CreateWarehouseInput = {
      name: values.name,
      provinceCode: values.provinceCode,
      provinceName: province?.name,
      wardCode: values.wardCode,
      wardName: ward?.name,
      addressDetail: values.addressDetail || undefined,
      isMain: values.isMain,
    };

    if (isEditing && warehouse) {
      updateWarehouse.mutate(
        { id: warehouse.id, input: payload },
        { onSuccess: () => handleOpenChange(false) },
      );
    } else {
      createWarehouse.mutate(payload, {
        onSuccess: () => handleOpenChange(false),
      });
    }
  };

  const isLoadingInitialData = isEditing && isLoadingDetail;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="md:min-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa kho hàng" : "Thêm kho hàng"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin kho hàng."
              : "Nhập thông tin kho hàng mới."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingInitialData ? (
          <div className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>
                  Tên kho hàng <span className="text-destructive">*</span>
                </FieldLabel>
                <Skeleton className="h-9 w-full" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Tỉnh/Thành phố</FieldLabel>
                  <Skeleton className="h-9 w-full" />
                </Field>

                <Field>
                  <FieldLabel>Phường/Xã</FieldLabel>
                  <Skeleton className="h-9 w-full" />
                </Field>
              </div>

              <Field>
                <FieldLabel>Địa chỉ cụ thể</FieldLabel>
                <Skeleton className="h-9 w-full" />
              </Field>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex flex-col gap-0.5">
                  <Label>Kho chính</Label>
                  <span className="text-xs text-muted-foreground">
                    Đặt làm kho mặc định cho các thao tác nhập/xuất hàng.
                  </span>
                </div>
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Huỷ
              </Button>
              <Button type="button" disabled>
                Lưu
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel>
                  Tên kho hàng <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  placeholder="Nhập tên kho hàng"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
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

              <Controller
                control={form.control}
                name="isMain"
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex flex-col gap-0.5">
                      <Label>Kho chính</Label>
                      <span className="text-xs text-muted-foreground">
                        Đặt làm kho mặc định cho các thao tác nhập/xuất hàng.
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner className="size-4" />}
                {isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
