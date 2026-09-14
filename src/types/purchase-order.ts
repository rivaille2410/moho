export type PurchaseOrderStatus =
  | "DRAFT"
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export interface PurchaseOrderItem {
  id: string;
  variantId: string;
  variant?: {
    id: string;
    name: string;
    colorName: string | null;
    colorHex: string | null;
    product: { id: string; name: string; sku: string };
  };
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: string;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplier: { id: string; name: string };
  warehouse: { id: string; name: string };
  status: PurchaseOrderStatus;
  note?: string | null;
  expectedAt?: string | null;
  receivedAt?: string | null;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderItemInput {
  variantId: string;
  quantityOrdered: number;
  unitCost: number;
}

export interface CreatePurchaseOrderInput {
  supplierId: string;
  warehouseId: string;
  note?: string;
  expectedAt?: string;
  items: CreatePurchaseOrderItemInput[];
}

export interface UpdatePurchaseOrderStatusInput {
  status: PurchaseOrderStatus;
}

export interface ReceivePurchaseOrderItemInput {
  purchaseOrderItemId: string;
  quantity: number;
}

export interface ReceivePurchaseOrderInput {
  items: ReceivePurchaseOrderItemInput[];
}

export interface QueryPurchaseOrdersParams {
  supplierId?: string;
  warehouseId?: string;
  status?: PurchaseOrderStatus;
  page?: number;
  limit?: number;
  search?: string;
}
