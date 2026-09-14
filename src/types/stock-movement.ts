export type StockMovementType =
  | "PURCHASE_IN"
  | "SALE_OUT"
  | "RETURN_IN"
  | "ADJUSTMENT"
  | "DAMAGED_OUT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT";

export type StockMovement = {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  colorName?: string | null;
  colorHex?: string | null;
  imageUrl?: string | null;
  warehouseId: string;
  warehouseName: string;
  type: StockMovementType;
  quantity: number;
  referenceType?: string | null;
  referenceId?: string | null;
  note?: string | null;
  createdAt: string;
};

export type CreateStockAdjustmentInput = {
  variantId: string;
  warehouseId: string;
  delta: number;
  note?: string;
};

export type QueryStockMovementsParams = {
  variantId?: string;
  warehouseId?: string;
  type?: StockMovementType;
  search?: string;
  page?: number;
  limit?: number;
};
