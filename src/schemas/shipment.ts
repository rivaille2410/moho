import { z } from "zod";

import { Shipment } from "@/types/shipment";

export const shipmentItemSchema = z.object({
  orderItemId: z.string().uuid({ message: "Order Item ID không hợp lệ" }),
  quantity: z.number().int().min(1, "Số lượng phải >= 1"),
});

export const parseLocalDate = (v: string) => new Date(`${v}T00:00:00`);

export const shipmentInfoSchema = z.object({
  trackingCode: z.string().trim().max(100, "Tối đa 100 ký tự").optional(),
  driverName: z.string().trim().max(100, "Tối đa 100 ký tự").optional(),
  driverPhone: z
    .string()
    .trim()
    .max(20, "Tối đa 20 ký tự")
    .regex(/^(0|\+84)\d{9,10}$/, "SĐT không hợp lệ")
    .or(z.literal(""))
    .optional(),
  vehiclePlate: z.string().trim().max(20, "Tối đa 20 ký tự").optional(),
  scheduledAt: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(parseLocalDate(v).getTime()), {
      message: "Ngày không hợp lệ",
    })
    .refine(
      (v) => {
        if (!v) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parseLocalDate(v).getTime() >= today.getTime();
      },
      { message: "Ngày giao phải từ hôm nay trở đi" },
    ),
  note: z.string().trim().optional(),
});

export type ShipmentInfoFormValues = z.infer<typeof shipmentInfoSchema>;

export function buildDefaultShipmentInfoValues(): ShipmentInfoFormValues {
  return {
    trackingCode: "",
    driverName: "",
    driverPhone: "",
    vehiclePlate: "",
    scheduledAt: "",
    note: "",
  };
}

const emptyToUndefined = (v?: string) => v?.trim() || undefined;

export function normalizeShipmentInfo(values: ShipmentInfoFormValues) {
  return {
    trackingCode: emptyToUndefined(values.trackingCode),
    driverName: emptyToUndefined(values.driverName),
    driverPhone: emptyToUndefined(values.driverPhone),
    vehiclePlate: emptyToUndefined(values.vehiclePlate),
    scheduledAt: values.scheduledAt
      ? parseLocalDate(values.scheduledAt).toISOString()
      : undefined,
    note: emptyToUndefined(values.note),
  };
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateTrackingCode = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(
    bytes,
    (b) => CODE_CHARS[b % CODE_CHARS.length],
  ).join("");

  return `VD-${yy}${mm}${dd}-${suffix}`;
};

export const createShipmentSchema = shipmentInfoSchema.extend({
  orderId: z.string().uuid({ message: "Vui lòng chọn đơn hàng" }),
  items: z.array(shipmentItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

export function toDateInputValue(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildShipmentInfoValuesFromShipment(
  shipment: Pick<
    Shipment,
    | "trackingCode"
    | "driverName"
    | "driverPhone"
    | "vehiclePlate"
    | "scheduledAt"
    | "note"
  >,
): ShipmentInfoFormValues {
  return {
    trackingCode: shipment.trackingCode ?? "",
    driverName: shipment.driverName ?? "",
    driverPhone: shipment.driverPhone ?? "",
    vehiclePlate: shipment.vehiclePlate ?? "",
    scheduledAt: toDateInputValue(shipment.scheduledAt),
    note: shipment.note ?? "",
  };
}
