import { z } from "zod";

import { Shipment } from "@/types/shipment";

export const shipmentItemSchema = z.object({
  orderItemId: z.string().uuid({ message: "Order Item ID không hợp lệ" }),
  quantity: z.number().int().min(1, "Số lượng phải >= 1"),
});

export const parseLocalDate = (v: string) => new Date(`${v}T00:00:00`);

export const toLocalPhone = (phone?: string | null) =>
  (phone ?? "")
    .replace(/\D/g, "")
    .replace(/^84/, "")
    .replace(/^0+/, "")
    .slice(0, 9);

export const toInternationalPhone = (local?: string) =>
  local?.trim() ? `+84${local.trim()}` : undefined;

const emptyToUndefined = (v?: string) => v?.trim() || undefined;

export const shipmentInfoSchema = z.object({
  driverName: z.string().trim().max(100, "Tối đa 100 ký tự").optional(),

  driverPhone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "SĐT phải gồm 9 chữ số")
    .or(z.literal(""))
    .optional(),

  vehiclePlate: z.string().trim().max(20, "Tối đa 20 ký tự").optional(),

  trackingCode: z
    .string()
    .trim()
    .min(1, "Mã vận đơn không được để trống")
    .max(50, "Tối đa 50 ký tự"),

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
      {
        message: "Ngày giao phải từ hôm nay trở đi",
      },
    ),

  note: z.string().trim().optional(),
});

export type ShipmentInfoFormValues = z.infer<typeof shipmentInfoSchema>;

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

export function buildDefaultShipmentInfoValues(): ShipmentInfoFormValues {
  return {
    driverName: "",
    driverPhone: "",
    vehiclePlate: "",
    trackingCode: generateTrackingCode(),
    scheduledAt: "",
    note: "",
  };
}

export function normalizeShipmentInfo(values: ShipmentInfoFormValues) {
  return {
    driverName: emptyToUndefined(values.driverName),

    driverPhone: toInternationalPhone(values.driverPhone),

    vehiclePlate: emptyToUndefined(values.vehiclePlate),

    trackingCode: emptyToUndefined(values.trackingCode),

    scheduledAt: values.scheduledAt
      ? parseLocalDate(values.scheduledAt).toISOString()
      : undefined,

    note: emptyToUndefined(values.note),
  };
}

export const createShipmentSchema = shipmentInfoSchema.extend({
  orderId: z.string().uuid({
    message: "Vui lòng chọn đơn hàng",
  }),

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
    | "driverName"
    | "driverPhone"
    | "vehiclePlate"
    | "trackingCode"
    | "scheduledAt"
    | "note"
  >,
): ShipmentInfoFormValues {
  return {
    driverName: shipment.driverName ?? "",

    driverPhone: toLocalPhone(shipment.driverPhone),

    vehiclePlate: shipment.vehiclePlate ?? "",

    trackingCode: shipment.trackingCode ?? "",

    scheduledAt: toDateInputValue(shipment.scheduledAt),

    note: shipment.note ?? "",
  };
}
