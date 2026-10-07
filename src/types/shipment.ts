import { type OrderStatus } from "@/types/order";

export type ShipmentStatus =
  | "PREPARING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export type ShippingProvider = "MANUAL";

export interface ShipmentOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
}

export interface ShipmentItem {
  orderItemId: string;
  productId: string;
  productName: string;
  variantName: string;
  thumbnailUrl?: string | null;
  quantity: number;
  orderedQuantity: number;
}

export interface Shipment {
  id: string;
  code: string;
  orderId: string;
  order: ShipmentOrderSummary;
  status: ShipmentStatus;
  provider: ShippingProvider;
  trackingCode?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  vehiclePlate?: string | null;
  scheduledAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  failedReason?: string | null;
  note?: string | null;
  items: ShipmentItem[];
  createdBy?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShippableOrderItem {
  orderItemId: string;
  productName: string;
  variantName: string;
  thumbnailUrl: string | null;
  orderedQuantity: number;
  remainingQuantity: number;
}

export interface ShippableOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  createdAt: string;
  items: ShippableOrderItem[];
}

export interface CreateShipmentInput {
  orderId: string;
  trackingCode?: string;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  scheduledAt?: string;
  note?: string;
  items: { orderItemId: string; quantity: number }[];
}

export interface UpdateShipmentInput {
  trackingCode?: string;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  scheduledAt?: string;
  note?: string;
}

export interface UpdateShipmentStatusInput {
  status: ShipmentStatus;
  failedReason?: string;
  deliveredAt?: string;
  collectedAmount?: number;
}

export interface QueryShipmentsParams {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
  orderId?: string;
  search?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
}

export interface QueryShippableOrdersParams {
  search?: string;
  limit?: number;
}
