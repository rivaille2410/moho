"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  X,
  Plus,
  Minus,
  Check,
  Ticket,
  QrCode,
  Banknote,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Address } from "@/types/address";
import { useCheckoutInfoStore } from "@/store/checkout-info";
import { useCartView } from "@/features/cart/hooks/use-cart-view";
import { CreateOrderItemInput, PaymentMethod } from "@/types/order";
import { CheckoutFormValues, checkoutSchema } from "@/schemas/order";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";

import { useProvinces } from "@/features/addresses/hooks/use-provinces";
import { useAddresses } from "@/features/addresses/hooks/use-addresses";
import { useCreateAddress } from "@/features/addresses/hooks/use-create-address";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useCreateOrder } from "@/features/orders/hooks/use-create-order";
import { toLocalDigits } from "@/features/addresses/utils/format-address";
import { useProvinceWards } from "@/features/addresses/hooks/use-province-wards";
import { useValidateVoucher } from "@/features/vouchers/hooks/use-validate-voucher";
import { CheckoutAddressPicker } from "@/features/addresses/components/checkout-address-picker";
import { toast } from "@/components/ui/toast";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

const BANK_INFO = {
  bin: "970436",
  accountNo: "0123456789",
  accountName: "CONG TY TNHH MOHO",
  bankName: "Vietcombank",
};

function RequiredMark() {
  return <span className="text-destructive">*</span>;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hasHydrated, isMerging, updateQuantity, clear } =
    useCartView();
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: me } = useCurrentUser();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: createAddress } = useCreateAddress();

  const savedInfo = useCheckoutInfoStore((s) => s.info);
  const checkoutInfoHydrated = useCheckoutInfoStore((s) => s.hasHydrated);

  const { data: addressData, isLoading: isLoadingAddresses } = useAddresses();
  const addresses = useMemo(() => addressData?.data ?? [], [addressData?.data]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addressPicked, setAddressPicked] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      provinceCode: undefined,
      wardCode: undefined,
      addressDetail: "",
      note: "",
    },
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [submitPhase, setSubmitPhase] = useState<"saving-address" | "creating-order" | null>(null);

  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    voucherId: string;
    code: string;
    discountAmount: number;
  } | null>(null);
  const validateVoucher = useValidateVoucher();

  const applyAddress = useCallback(
    (address: Address) => {
      setSelectedAddressId(address.id);
      setValue("fullName", address.recipientName, { shouldValidate: true });
      setValue("phone", toLocalDigits(address.recipientPhone), {
        shouldValidate: true,
      });
      setValue("provinceCode", address.provinceCode, { shouldValidate: true });
      setValue("wardCode", address.wardCode, { shouldValidate: true });
      setValue("addressDetail", address.addressDetail, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  useEffect(() => {
    if (addressPicked || addresses.length === 0) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    applyAddress(def);
    setAddressPicked(true);
  }, [addresses, addressPicked, applyAddress]);

  useEffect(() => {
    if (!selectedAddressId) return;
    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId,
    );
    if (selectedAddress) applyAddress(selectedAddress);
  }, [addresses, selectedAddressId, applyAddress]);

  useEffect(() => {
    if (!checkoutInfoHydrated || isLoadingAddresses) return;
    if (addresses.length > 0) return;

    if (savedInfo) {
      setValue("fullName", savedInfo.fullName, { shouldValidate: false });
      setValue("phone", savedInfo.phone, { shouldValidate: false });
      setValue("provinceCode", savedInfo.provinceCode, {
        shouldValidate: false,
      });
      setValue("wardCode", savedInfo.wardCode, { shouldValidate: false });
      setValue("addressDetail", savedInfo.addressDetail, {
        shouldValidate: false,
      });
    } else if (me?.name) {
      setValue("fullName", me.name, { shouldValidate: false });
    }
  }, [
    checkoutInfoHydrated,
    isLoadingAddresses,
    addresses.length,
    savedInfo,
    me?.name,
    setValue,
  ]);

  const provinceCode = watch("provinceCode");

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: wards, isLoading: isLoadingWards } =
    useProvinceWards(provinceCode);

  const discountAmount = appliedVoucher?.discountAmount ?? 0;
  const grandTotal = Math.max(totalPrice - discountAmount, 0);

  const previewRef = "MOHO" + Date.now().toString().slice(-8);

  const vietqrUrl = `https://img.vietqr.io/image/${BANK_INFO.bin}-${BANK_INFO.accountNo}-compact2.png?amount=${grandTotal}&addInfo=${encodeURIComponent(
    previewRef,
  )}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

  const buildOrderItems = (): CreateOrderItemInput[] =>
    items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    }));

  const handleApplyVoucher = () => {
    const code = voucherInput.trim();
    if (!code) return;

    validateVoucher.mutate(
      {
        code,
        subtotal: totalPrice,
        productIds: items.map((item) => item.productId),
        categoryIds: [],
      },
      {
        onSuccess: (result) => {
          setAppliedVoucher({
            voucherId: result.voucherId,
            code: result.code,
            discountAmount: result.discountAmount,
          });
        },
      },
    );
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    validateVoucher.reset();
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;

    try {
      let addressId = selectedAddressId;
      if (!addressId) {
        setSubmitPhase("saving-address");
        const province = provinces?.find(
          (item) => item.code === data.provinceCode,
        );
        const ward = wards?.find((item) => item.code === data.wardCode);
        if (!province || !ward) {
          toast.add({
            type: "error",
            description: "Vui lòng chọn tỉnh/thành và phường/xã hợp lệ.",
            priority: "high",
          });
          return;
        }

        const address = await createAddress({
          recipientName: data.fullName.trim(),
          recipientPhone: `+84${toLocalDigits(data.phone)}`,
          provinceCode: province.code,
          provinceName: province.name,
          wardCode: ward.code,
          wardName: ward.name,
          addressDetail: data.addressDetail.trim(),
          isDefault: addresses.length === 0,
        });
        if (!address.id) {
          throw new Error("Không nhận được mã địa chỉ vừa lưu. Vui lòng thử lại.");
        }
        addressId = address.id;
        setSelectedAddressId(address.id);
      }

      setSubmitPhase("creating-order");
      const order = await createOrder({
        addressId,
        note: data.note?.trim() || undefined,
        paymentMethod,
        items: buildOrderItems(),
        voucherCode: appliedVoucher?.code,
      });

      clear();
      router.push(`/checkout/success?ref=${order.orderNumber}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitPhase(null);
    }
  };

  const isLoading = !hasHydrated || isMerging;

  if (isLoading) {
    return (
      <div className="pb-12 space-y-3">
        <PageBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán" },
          ]}
        />
        <div className="wrapper">
          <Skeleton className="h-8 w-40" />

          <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-lg border p-4 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <Skeleton className="h-5 w-40" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <Skeleton className="h-5 w-32" />
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-18 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-7 w-24 rounded-md" />
                  </div>
                </div>
              ))}
              <div className="h-px bg-border" />
              <Skeleton className="h-9 w-full" />
              <div className="h-px bg-border" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          {isMerging ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Đang đồng bộ giỏ hàng...
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pb-12 space-y-3">
        <PageBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Giỏ hàng", href: "/cart" },
            { label: "Thanh toán" },
          ]}
        />
        <div className="wrapper">
          <div className="flex flex-col items-center justify-center gap-4 py-44 text-center 2xl:py-80">
            <ShoppingBag
              className="size-16 text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <p className="text-base font-medium">
              Giỏ hàng của bạn đang trống, không có gì để thanh toán.
            </p>
            <Link href="/products">
              <Button size="xl" className="gap-2">
                <ArrowLeft className="size-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-3">
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/cart" },
          { label: "Thanh toán" },
        ]}
      />

      <div className="wrapper space-y-3">
        <h1 className="text-2xl font-semibold">Thanh toán</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3"
        >
          <div className="space-y-4 lg:col-span-2">
            <CheckoutAddressPicker
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={applyAddress}
              onDeleted={(address) => {
                if (selectedAddressId !== address.id) return;
                setSelectedAddressId(null);
                setValue("fullName", "", { shouldValidate: false });
                setValue("phone", "", { shouldValidate: false });
                setValue("provinceCode", undefined, { shouldValidate: false });
                setValue("wardCode", undefined, { shouldValidate: false });
                setValue("addressDetail", "", { shouldValidate: false });
              }}
            />

            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Thông tin người nhận</h2>
                {savedInfo && addresses.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => useCheckoutInfoStore.getState().clearInfo()}
                    className="text-xs text-muted-foreground underline hover:text-foreground"
                  >
                    Xoá thông tin đã lưu
                  </button>
                ) : null}
              </div>

              <p className="rounded-md border border-secondary/25 bg-secondary/10 px-3 py-2 text-sm font-normal text-foreground">
                Shop sẽ liên hệ bạn sau khi đặt hàng để xác nhận phí vận chuyển.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="fullName">
                  Họ và tên <RequiredMark />
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName", {
                    onChange: () => setSelectedAddressId(null),
                  })}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName ? (
                  <p className="text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Số điện thoại <RequiredMark />
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r px-3 text-sm text-muted-foreground">
                    +84
                  </span>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        id="phone"
                        inputMode="numeric"
                        value={field.value}
                        onChange={(e) => {
                          setSelectedAddressId(null);
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
                {errors.phone ? (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>
                    Tỉnh/Thành phố <RequiredMark />
                  </Label>
                  <Controller
                    control={control}
                    name="provinceCode"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                          if (!value) return;
                          setSelectedAddressId(null);
                          field.onChange(Number(value));
                          resetField("wardCode");
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
                  <Label>
                    Phường/Xã <RequiredMark />
                  </Label>
                  <Controller
                    control={control}
                    name="wardCode"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                          if (!value) return;
                          setSelectedAddressId(null);
                          field.onChange(Number(value));
                        }}
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
                                  ?.name ??
                                (isLoadingWards
                                  ? "Đang tải..."
                                  : "Chọn phường/xã")
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
                  {errors.wardCode ? (
                    <p className="text-xs text-destructive">
                      {errors.wardCode.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addressDetail">
                  Địa chỉ cụ thể <RequiredMark />
                </Label>
                <Input
                  id="addressDetail"
                  {...register("addressDetail", {
                    onChange: () => setSelectedAddressId(null),
                  })}
                  placeholder="Số nhà, tên đường..."
                />
                {errors.addressDetail ? (
                  <p className="text-xs text-destructive">
                    {errors.addressDetail.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
                <Textarea
                  id="note"
                  {...register("note")}
                  placeholder="Nhập ghi chú, ví dụ: giao giờ hành chính, gọi trước khi giao..."
                  rows={2}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition",
                    paymentMethod === "COD"
                      ? "border-secondary ring-3 ring-secondary/20"
                      : "border-border hover:border-secondary/50",
                  )}
                >
                  <Banknote className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <div>
                    <p className="text-sm font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Thanh toán bằng tiền mặt cho nhân viên giao hàng.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition",
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-secondary ring-3 ring-secondary/20"
                      : "border-border hover:border-secondary/50",
                  )}
                >
                  <QrCode className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <div>
                    <p className="text-sm font-medium">
                      Chuyển khoản qua mã QR
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Quét mã QR để chuyển khoản. Đơn hàng được xử lý sau khi
                      shop xác nhận thanh toán.
                    </p>
                  </div>
                </button>
              </div>

              {paymentMethod === "BANK_TRANSFER" ? (
                <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/40 p-4">
                  <div className="relative size-72 overflow-hidden rounded-xl border bg-white">
                    <Image
                      fill
                      src={vietqrUrl}
                      alt="Mã QR chuyển khoản"
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>

                  <div className="w-full space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngân hàng</span>
                      <span className="font-medium">{BANK_INFO.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Số tài khoản
                      </span>
                      <span className="font-medium">{BANK_INFO.accountNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Chủ tài khoản
                      </span>
                      <span className="font-medium">
                        {BANK_INFO.accountName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nội dung CK</span>
                      <span className="font-medium">{previewRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số tiền</span>
                      <span className="text-base font-medium text-secondary">
                        {formatVND(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    Vui lòng chuyển đúng số tiền và nội dung để đơn hàng được
                    xác nhận nhanh nhất. Shop sẽ duyệt đơn thủ công sau khi nhận
                    được tiền.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="sticky top-20 space-y-4 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Đơn hàng của bạn</h2>

            <div className="max-h-96 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative size-18 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {item.thumbnailUrl ? (
                      <Image
                        fill
                        sizes="56px"
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {item.productName}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>

                    {item.variantName ? (
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className="size-3 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: item.variantColor ?? "#e5e5e5",
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {item.variantName}
                        </p>
                      </div>
                    ) : null}

                    {item.dimensions ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Kích thước: {item.dimensions}
                      </p>
                    ) : null}

                    {item.materials ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        Chất liệu: {item.materials}
                      </p>
                    ) : null}

                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-secondary">
                        {formatVND(item.price)}
                      </span>
                      {item.compareAtPrice ? (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatVND(item.compareAtPrice)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 border-x py-1.5 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2 disabled:opacity-40"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-secondary">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              {appliedVoucher ? (
                <div className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-dashed border-secondary bg-linear-to-r from-secondary/10 via-secondary/5 to-transparent px-3 py-2.5">
                  <div className="absolute top-1/2 -left-2 size-4 -translate-y-1/2 rounded-full bg-background" />
                  <div className="absolute top-1/2 -right-2 size-4 -translate-y-1/2 rounded-full bg-background" />

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Ticket className="size-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold tracking-wide">
                        {appliedVoucher.code}
                      </p>
                      <Check className="size-3.5 shrink-0 text-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bạn tiết kiệm được{" "}
                      <span className="font-semibold text-secondary">
                        {formatVND(appliedVoucher.discountAmount)}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="shrink-0 rounded-full p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : validateVoucher.isPending ? (
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    value={voucherInput}
                    onChange={(e) =>
                      setVoucherInput(e.target.value.toUpperCase())
                    }
                    startIcon={<Ticket />}
                    placeholder="Nhập mã giảm giá"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyVoucher();
                      }
                    }}
                  />
                  <Button
                    size={"lg"}
                    type="button"
                    disabled={!voucherInput.trim()}
                    onClick={handleApplyVoucher}
                  >
                    Áp dụng
                  </Button>
                </div>
              )}
              {validateVoucher.isError && !appliedVoucher ? (
                <p className="text-xs text-destructive">
                  {validateVoucher.error.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 text-sm">
              {appliedVoucher ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="font-medium text-secondary">
                    -{formatVND(discountAmount)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-xl font-bold text-secondary">
                {formatVND(grandTotal)}
              </span>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner className="size-4" />}
                {submitPhase === "saving-address"
                  ? "Đang lưu địa chỉ..."
                  : submitPhase === "creating-order"
                    ? "Đang tạo đơn..."
                    : "Đặt hàng"}
              </Button>

              <Link href="/cart" className="block">
                <Button
                  type="button"
                  size="xl"
                  variant="outline"
                  className="w-full gap-2"
                >
                  <ArrowLeft className="size-4" />
                  Quay lại giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
