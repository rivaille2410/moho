"use client";

import { Percent } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { blockNegativeKeys } from "@/lib/input-guards";

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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DateTimePicker } from "@/components/ui/date-time-picker";

import {
  updateVoucherSchema,
  UpdateVoucherFormValues,
  UpdateVoucherFormOutput,
} from "@/schemas/voucher";
import { type Voucher } from "@/types/voucher";
import { useProducts } from "@/features/products/hooks/use-products";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useUpdateVoucher } from "@/features/vouchers/hooks/use-update-voucher";

const typeItems = [
  { label: "Giảm theo %", value: "PERCENT" },
  { label: "Giảm số tiền cố định", value: "FIXED" },
];

const SCOPE_LABEL: Record<Voucher["scope"], string> = {
  ALL: "Toàn bộ đơn hàng",
  CATEGORY: "Theo danh mục",
  PRODUCT: "Theo sản phẩm",
};

function toDatetimeLocal(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

export function VoucherGeneralForm({ voucher }: { voucher: Voucher }) {
  const updateVoucher = useUpdateVoucher();

  const { data: categories } = useCategories();
  const categoryOptions = (categories ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { data: productsResponse } = useProducts({ limit: 1000 });
  const productOptions = (productsResponse?.data ?? []).map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const form = useForm<
    UpdateVoucherFormValues,
    unknown,
    UpdateVoucherFormOutput
  >({
    resolver: zodResolver(updateVoucherSchema),
    defaultValues: {
      name: voucher.name,
      description: voucher.description ?? "",
      type: voucher.type,
      value: voucher.value,
      maxDiscount: voucher.maxDiscount ?? undefined,
      minOrderValue: voucher.minOrderValue,
      categoryIds: voucher.categoryIds,
      productIds: voucher.productIds,
      usageLimit: voucher.usageLimit ?? undefined,
      usageLimitPerUser: voucher.usageLimitPerUser,
      startAt: toDatetimeLocal(voucher.startAt),
      endAt: toDatetimeLocal(voucher.endAt),
      isPublic: voucher.isPublic,
    },
  });

  const type = form.watch("type");
  const startAt = form.watch("startAt");

  const onSubmit = (values: UpdateVoucherFormOutput) => {
    if (
      voucher.scope === "CATEGORY" &&
      (!values.categoryIds || values.categoryIds.length === 0)
    ) {
      form.setError("categoryIds", {
        message: "Vui lòng chọn ít nhất 1 danh mục",
      });
      return;
    }
    if (
      voucher.scope === "PRODUCT" &&
      (!values.productIds || values.productIds.length === 0)
    ) {
      form.setError("productIds", {
        message: "Vui lòng chọn ít nhất 1 sản phẩm",
      });
      return;
    }

    updateVoucher.mutate({
      id: voucher.id,
      payload: {
        ...values,
        description: values.description || undefined,
        maxDiscount: values.type === "PERCENT" ? values.maxDiscount : undefined,
        categoryIds:
          voucher.scope === "CATEGORY" ? values.categoryIds : undefined,
        productIds: voucher.scope === "PRODUCT" ? values.productIds : undefined,
        startAt: new Date(values.startAt).toISOString(),
        endAt: new Date(values.endAt).toISOString(),
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Tên voucher</FieldLabel>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <FieldError>{form.formState.errors.name.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Mô tả — không bắt buộc</FieldLabel>
          <Textarea rows={2} {...form.register("description")} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Loại giảm giá</FieldLabel>
            <Select
              items={typeItems}
              value={type}
              onValueChange={(value: string | null) =>
                form.setValue(
                  "type",
                  (value ?? "PERCENT") as "PERCENT" | "FIXED",
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                {typeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>
              Giá trị {type === "PERCENT" ? "(%)" : "(VNĐ)"}
            </FieldLabel>
            {type === "PERCENT" ? (
              <Input
                type="number"
                min={0}
                max={100}
                startIcon={<Percent />}
                onKeyDown={blockNegativeKeys}
                {...form.register("value")}
              />
            ) : (
              <Controller
                control={form.control}
                name="value"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
            {form.formState.errors.value && (
              <FieldError>{form.formState.errors.value.message}</FieldError>
            )}
          </Field>

          {type === "PERCENT" && (
            <Field>
              <FieldLabel>Giảm tối đa — không bắt buộc</FieldLabel>
              <Controller
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
          )}

          <Field>
            <FieldLabel>Phạm vi áp dụng</FieldLabel>
            <Input value={SCOPE_LABEL[voucher.scope]} disabled />
          </Field>

          {voucher.scope === "CATEGORY" && (
            <Field>
              <FieldLabel>Danh mục áp dụng</FieldLabel>
              <Controller
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <MultiSelect
                    options={categoryOptions}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Chọn danh mục áp dụng"
                  />
                )}
              />
              {form.formState.errors.categoryIds && (
                <FieldError>
                  {form.formState.errors.categoryIds.message}
                </FieldError>
              )}
            </Field>
          )}

          {voucher.scope === "PRODUCT" && (
            <Field>
              <FieldLabel>Sản phẩm áp dụng</FieldLabel>
              <Controller
                control={form.control}
                name="productIds"
                render={({ field }) => (
                  <MultiSelect
                    options={productOptions}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Chọn sản phẩm áp dụng"
                  />
                )}
              />
              {form.formState.errors.productIds && (
                <FieldError>
                  {form.formState.errors.productIds.message}
                </FieldError>
              )}
            </Field>
          )}

          <Field>
            <FieldLabel>Đơn tối thiểu</FieldLabel>
            <Controller
              control={form.control}
              name="minOrderValue"
              render={({ field }) => (
                <CurrencyInput
                  value={field.value as number | undefined}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Lượt dùng / khách hàng</FieldLabel>
            <Input
              type="number"
              min={0}
              step={1}
              onKeyDown={blockNegativeKeys}
              {...form.register("usageLimitPerUser")}
            />
          </Field>

          <Field>
            <FieldLabel>Tổng lượt dùng — không bắt buộc</FieldLabel>
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Để trống nếu không giới hạn"
              onKeyDown={blockNegativeKeys}
              {...form.register("usageLimit")}
            />
          </Field>

          <Field>
            <FieldLabel>Trạng thái công khai</FieldLabel>
            <div className="flex h-9 items-center">
              <Switch
                checked={form.watch("isPublic")}
                onCheckedChange={(checked) =>
                  form.setValue("isPublic", checked)
                }
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>Ngày bắt đầu</FieldLabel>
            <Controller
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn ngày bắt đầu"
                />
              )}
            />
            {form.formState.errors.startAt && (
              <FieldError>{form.formState.errors.startAt.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Ngày kết thúc</FieldLabel>
            <Controller
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn ngày kết thúc"
                  disabled={(date) => {
                    if (!startAt) return false;
                    const startDay = new Date(startAt);
                    startDay.setHours(0, 0, 0, 0);
                    return date < startDay;
                  }}
                />
              )}
            />
            {form.formState.errors.endAt && (
              <FieldError>{form.formState.errors.endAt.message}</FieldError>
            )}
          </Field>
        </div>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateVoucher.isPending}>
          {updateVoucher.isPending && <Spinner className="size-4" />}
          {updateVoucher.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
