export type ReturnReason =
  | "WRONG_ITEM"
  | "DEFECTIVE"
  | "DAMAGED_ON_ARRIVAL"
  | "NOT_AS_DESCRIBED"
  | "CHANGE_OF_MIND"
  | "OTHER";

export type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ITEM_RECEIVED"
  | "REFUNDED"
  | "COMPLETED"
  | "CANCELLED";

export type RefundMethod = "BANK_TRANSFER" | "ORIGINAL_PAYMENT_METHOD";

export type ReturnRequestItem = {
  id: string;
  orderItemId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  thumbnailUrl: string | null;
  colorHex: string | null;
  colorName: string | null;
  quantity: number;
  unitPrice: string;
};

export type ReturnRequest = {
  id: string;
  code: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string | null;
  reason: ReturnReason;
  reasonNote?: string | null;
  status: ReturnStatus;
  refundAmount: string;
  refundMethod?: RefundMethod | null;
  refundBankName?: string | null;
  refundBankAccountNumber?: string | null;
  refundBankAccountHolder?: string | null;
  refundProofImageUrl?: string | null;
  adminNote?: string | null;
  rejectReason?: string | null;
  items: ReturnRequestItem[];
  images: string[];
  approvedAt?: string | null;
  itemReceivedAt?: string | null;
  refundedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReturnRequestListItem = ReturnRequest;

export type MyReturnRequestListItem = {
  id: string;
  code: string;
  orderId: string;
  orderNumber: string;
  reason: ReturnReason;
  reasonNote?: string | null;
  status: ReturnStatus;
  refundAmount: string;
  images: string[];
  createdAt: string;
};

import { PaginationMeta } from "./shared";

export type PaginatedReturnRequests = {
  data: ReturnRequest[];
  meta: PaginationMeta;
};

export type QueryReturnRequestsInput = {
  search?: string;
  status?: ReturnStatus;
  page?: number;
  limit?: number;
};

export type CreateReturnRequestInput = {
  orderId: string;
  reason: ReturnReason;
  reasonNote?: string;
  items: { orderItemId: string; quantity: number }[];
};

export type ApproveReturnRequestInput = {
  adminNote?: string;
};

export type RejectReturnRequestInput = {
  rejectReason: string;
};

export type ProcessRefundInput = {
  refundMethod: RefundMethod;
  refundBankName?: string;
  refundBankAccountNumber?: string;
  refundBankAccountHolder?: string;
};
