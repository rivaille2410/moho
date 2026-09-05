"use client";

import { useState } from "react";

import { Plus, Ticket } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { DateTimePicker } from "@/components/ui/date-time-picker";

import {
  createVoucherSchema,
  buildDefaultVoucherValues,
  type CreateVoucherFormValues,
  type CreateVoucherFormOutput,
} from "@/schemas/voucher";
import {
  useCategoryTree,
  flattenCategoryTree,
} from "@/features/categories/hooks/use-category-tree";
import { useProducts } from "@/features/products/hooks/use-products";
import { useCreateVoucher } from "@/features/vouchers/hooks/use-create-voucher";

interface CreateVoucherDialogProps {
  onCreated?: () => void;
}

export function CreateVoucherDialog({ onCreated }: CreateVoucherDialogProps) {
  const [open, setOpen] = useState(false);

  const createVoucher = useCreateVoucher();

  const { data: categoryTree } = useCategoryTree();
  const categoryOptions = flattenCategoryTree(categoryTree ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { data: productsResponse } = useProducts({ limit: 1000 });
  const productOptions = (productsResponse?.data ?? []).map(
    (p: { id: string; name: string }) => ({ label: p.name, value: p.id }),
  );

  const form = useForm<CreateVoucherFormValues, any, CreateVoucherFormOutput>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: buildDefaultVoucherValues(),
  });

  const scope = form.watch("scope");
  const type = form.watch("type");
  const startAt = form.watch("startAt");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset(buildDefaultVoucherValues());
    } else {
      createVoucher.reset();
    }
  };

  const onSubmit = (values: CreateVoucherFormOutput) => {
    createVoucher.mutate(
      {
        ...values,
        code: values.code.toUpperCase(),
        startAt: new Date(values.startAt).toISOString(),
        endAt: new Date(values.endAt).toISOString(),
        categoryIds:
          values.scope === "CATEGORY" ? values.categoryIds : undefined,
        productIds: values.scope === "PRODUCT" ? values.productIds : undefined,
      },
      {
        onSuccess: () => {
          handleOpenChange(false);
          onCreated?.();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size={"lg"}>
            <Plus className="size-4" />
            <span className="hidden xl:inline">Thêm voucher</span>
          </Button>
        }
      />

      <DialogContent className="md:min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm voucher mới</DialogTitle>
          <DialogDescription>
            Tạo mã giảm giá áp dụng cho toàn bộ đơn hàng, theo danh mục hoặc
            theo sản phẩm cụ thể.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Mã voucher</FieldLabel>
                <Input
                  startIcon={<Ticket />}
                  placeholder="VD: SUMMER2026"
                  {...form.register("code")}
                />
                {form.formState.errors.code && (
                  <FieldError>{form.formState.errors.code.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Tên voucher</FieldLabel>
                <Input
                  placeholder="Nhập tên voucher"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Mô tả — không bắt buộc</FieldLabel>
              <Textarea
                placeholder="Mô tả voucher"
                {...form.register("description")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Loại giảm giá</FieldLabel>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      items={[
                        { label: "Phần trăm (%)", value: "PERCENT" },
                        { label: "Số tiền cố định", value: "FIXED" },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENT">Phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED">Số tiền cố định</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>
                  Giá trị {type === "PERCENT" ? "(%)" : "(VNĐ)"}
                </FieldLabel>
                <Input
                  type="number"
                  placeholder="0"
                  {...form.register("value")}
                />
                {form.formState.errors.value && (
                  <FieldError>{form.formState.errors.value.message}</FieldError>
                )}
              </Field>
            </div>

            {type === "PERCENT" && (
              <Field>
                <FieldLabel>Giảm tối đa — không bắt buộc</FieldLabel>
                <Input
                  type="number"
                  placeholder="Không giới hạn"
                  {...form.register("maxDiscount")}
                />
                <FieldDescription>
                  Số tiền giảm tối đa khi áp dụng theo %.
                </FieldDescription>
              </Field>
            )}

            <Field>
              <FieldLabel>Giá trị đơn hàng tối thiểu</FieldLabel>
              <Input
                type="number"
                placeholder="0"
                {...form.register("minOrderValue")}
              />
            </Field>

            <Field>
              <FieldLabel>Phạm vi áp dụng</FieldLabel>
              <Controller
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <Select
                    items={[
                      { label: "Toàn bộ đơn hàng", value: "ALL" },
                      { label: "Theo danh mục", value: "CATEGORY" },
                      { label: "Theo sản phẩm", value: "PRODUCT" },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn phạm vi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toàn bộ đơn hàng</SelectItem>
                      <SelectItem value="CATEGORY">Theo danh mục</SelectItem>
                      <SelectItem value="PRODUCT">Theo sản phẩm</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            {scope === "CATEGORY" && (
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

            {scope === "PRODUCT" && (
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

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  Giới hạn tổng lượt dùng — không bắt buộc
                </FieldLabel>
                <Input
                  type="number"
                  placeholder="Không giới hạn"
                  {...form.register("usageLimit")}
                />
              </Field>

              <Field>
                <FieldLabel>Giới hạn lượt dùng / người dùng</FieldLabel>
                <Input
                  type="number"
                  placeholder="1"
                  {...form.register("usageLimitPerUser")}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <FieldError>
                    {form.formState.errors.startAt.message}
                  </FieldError>
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

            <Field orientation="horizontal">
              <FieldLabel>Công khai voucher</FieldLabel>
              <Controller
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
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
              disabled={createVoucher.isPending}
            >
              {createVoucher.isPending && <Spinner className="size-4" />}
              {createVoucher.isPending ? "Đang tạo..." : "Tạo voucher"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
