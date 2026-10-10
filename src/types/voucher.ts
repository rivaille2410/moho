export type VoucherType = "PERCENT" | "FIXED";
export type VoucherScope = "ALL" | "CATEGORY" | "PRODUCT";
export type VoucherStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "EXPIRED"
  | "DEPLETED";

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  type: VoucherType;
  value: number;
  maxDiscount?: number | null;
  minOrderValue: number;
  scope: VoucherScope;
  categoryIds: string[];
  productIds: string[];
  usageLimit?: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  startAt: string;
  endAt: string;
  status: VoucherStatus;
  effectiveStatus: VoucherStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherListItem {
  id: string;
  code: string;
  name: string;
  type: VoucherType;
  value: number;
  scope: VoucherScope;
  usedCount: number;
  usageLimit: number | null;
  startAt: string;
  endAt: string;
  effectiveStatus: VoucherStatus;
  createdAt: string;
}

import { PaginationMeta } from "./shared";

export interface PaginatedVouchers {
  data: VoucherListItem[];
  meta: PaginationMeta;
}

export interface QueryVouchersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: VoucherStatus;
  scope?: VoucherScope;
}

export interface CreateVoucherPayload {
  code: string;
  name: string;
  description?: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  scope: VoucherScope;
  categoryIds?: string[];
  productIds?: string[];
  usageLimit?: number;
  usageLimitPerUser?: number;
  startAt: string;
  endAt: string;
  status?: VoucherStatus;
  isPublic?: boolean;
}

export type CreateVoucherInput = CreateVoucherPayload;

export type UpdateVoucherPayload = Partial<Omit<CreateVoucherPayload, "code">>;
export type UpdateVoucherInput = UpdateVoucherPayload;

export interface UpdateVoucherStatusPayload {
  status: VoucherStatus;
}

export interface BulkDeleteVouchersPayload {
  ids: string[];
}

export interface ValidateVoucherPayload {
  code: string;
  subtotal: number;
  categoryIds?: string[];
  productIds?: string[];
}

export interface VoucherValidationResult {
  voucherId: string;
  code: string;
  discountAmount: number;
}
