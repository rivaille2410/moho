"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

import { useProvinces } from "../hooks/use-provinces";
import { useProvinceWards } from "../hooks/use-province-wards";
import { useCreateAddress } from "../hooks/use-create-address";
import { useUpdateAddress } from "../hooks/use-update-address";

import { Address } from "@/types/address";
import { toLocalDigits } from "../utils/format-address";
import { AddressFormValues, addressSchema } from "@/schemas/address";

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  isFirstAddress?: boolean;
}

const EMPTY_VALUES: AddressFormValues = {
  recipientName: "",
  recipientPhone: "",
  provinceCode: undefined as unknown as number,
  wardCode: undefined as unknown as number,
  addressDetail: "",
  isDefault: false,
};

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
  isFirstAddress = false,
}: AddressFormDialogProps) {
  const isEdit = Boolean(address);

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const isPending = createAddress.isPending || updateAddress.isPending;

  const {
    reset,
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: EMPTY_VALUES,
  });

  const provinceCode = watch("provinceCode");
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: wards, isLoading: isLoadingWards } =
    useProvinceWards(provinceCode);

  useEffect(() => {
    if (!open) return;

    if (address) {
      reset({
        recipientName: address.recipientName,
        recipientPhone: toLocalDigits(address.recipientPhone),
        provinceCode: address.provinceCode,
        wardCode: address.wardCode,
        addressDetail: address.addressDetail,
        isDefault: address.isDefault,
      });
    } else {
      reset({ ...EMPTY_VALUES, isDefault: isFirstAddress });
    }
  }, [open, address, isFirstAddress, reset]);

  const onSubmit = async (values: AddressFormValues) => {
    const province = provinces?.find((p) => p.code === values.provinceCode);
    const ward = wards?.find((w) => w.code === values.wardCode);
    if (!province || !ward) return;

    const payload = {
      recipientName: values.recipientName.trim(),
      recipientPhone: `+84${values.recipientPhone}`,
      provinceCode: province.code,
      provinceName: province.name,
      wardCode: ward.code,
      wardName: ward.name,
      addressDetail: values.addressDetail.trim(),
      isDefault: values.isDefault ?? false,
    };

    try {
      if (address) {
        await updateAddress.mutateAsync({ id: address.id, input: payload });
      } else {
        await createAddress.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {}
  };

  const lockDefaultCheckbox =
    isFirstAddress || (isEdit && !!address?.isDefault);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
          <DialogDescription>
            Địa chỉ này sẽ được dùng để giao hàng cho các đơn của bạn.
          </DialogDescription>
        </DialogHeader>

        <form
          id="address-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="recipientName">Họ và tên người nhận</Label>
            <Input
              id="recipientName"
              placeholder="Nhập họ và tên"
              {...register("recipientName")}
            />
            {errors.recipientName ? (
              <p className="text-xs text-destructive">
                {errors.recipientName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="recipientPhone">Số điện thoại</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r px-3 text-sm text-muted-foreground">
                +84
              </span>
              <Controller
                control={control}
                name="recipientPhone"
                render={({ field }) => (
                  <Input
                    id="recipientPhone"
                    inputMode="numeric"
                    className="pl-14"
                    placeholder="Nhập số điện thoại"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .replace(/\D/g, "")
                          .replace(/^0+/, "")
                          .slice(0, 9),
                      )
                    }
                  />
                )}
              />
            </div>
            {errors.recipientPhone ? (
              <p className="text-xs text-destructive">
                {errors.recipientPhone.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tỉnh/Thành phố</Label>
              <Controller
                control={control}
                name="provinceCode"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      if (!value) return;
                      field.onChange(Number(value));
                      setValue("wardCode", undefined as unknown as number);
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
              {errors.provinceCode ? (
                <p className="text-xs text-destructive">
                  {errors.provinceCode.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Phường/Xã</Label>
              <Controller
                control={control}
                name="wardCode"
                render={({ field }) => (
                  <Select
                    disabled={!provinceCode}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      if (!value) return;
                      field.onChange(Number(value));
                    }}
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
                        <SelectItem key={ward.code} value={String(ward.code)}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.wardCode ? (
                <p className="text-xs text-destructive">
                  {errors.wardCode.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addressDetail">Địa chỉ cụ thể</Label>
            <Input
              id="addressDetail"
              placeholder="Số nhà, tên đường..."
              {...register("addressDetail")}
            />
            {errors.addressDetail ? (
              <p className="text-xs text-destructive">
                {errors.addressDetail.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Controller
              control={control}
              name="isDefault"
              render={({ field }) => (
                <label className="flex w-fit items-center gap-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    disabled={lockDefaultCheckbox}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                  <span
                    className={
                      lockDefaultCheckbox ? "text-muted-foreground" : undefined
                    }
                  >
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>
              )}
            />
            {lockDefaultCheckbox ? (
              <p className="text-xs text-muted-foreground">
                {isFirstAddress
                  ? "Địa chỉ đầu tiên luôn là địa chỉ mặc định."
                  : "Hãy đặt một địa chỉ khác làm mặc định nếu muốn bỏ chọn."}
              </p>
            ) : null}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button type="submit" form="address-form" disabled={isPending}>
            {isPending ? <Spinner className="size-4" /> : null}
            {isEdit ? "Lưu thay đổi" : "Thêm địa chỉ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
