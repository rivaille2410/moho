export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod =
  | "COD"
  | "BANK_TRANSFER"
  | "VNPAY"
  | "MOMO"
  | "ZALOPAY";

export type PaymentStatus =
  | "PENDING"
  | "AWAITING_CONFIRM"
  | "CONFIRMED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type ConfirmationType = "MANUAL" | "WEBHOOK" | "COD_COLLECTION";

export type Payment = {
  id: string;
  method: PaymentMethod;
  confirmationType: ConfirmationType;
  status: PaymentStatus;
  amount: number;
  confirmedAt?: string;
  proofImageUrl?: string;
};

export type OrderUser = {
  id: string;
  name: string;
  avatar?: string;
};

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  thumbnailUrl?: string;
  price: number;
  quantity: number;
  isReviewed: boolean;
}

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  user: OrderUser;
  status: OrderStatus;
  payment?: Payment;
  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note: string | null;
  cancelReason: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderItemInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type CreateOrderInput = {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
  voucherCode?: string;
  paymentMethod?: PaymentMethod;
  items: CreateOrderItemInput[];
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
  cancelReason?: string;
};

export type QueryOrdersParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
  search?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type OrdersListResponse = {
  data: Order[];
  meta: PaginationMeta;
};
