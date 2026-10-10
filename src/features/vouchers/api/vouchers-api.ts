import { apiClient } from "@/lib/api-client";
import {
  CreateVoucherInput,
  PaginatedVouchers,
  QueryVouchersParams,
  UpdateVoucherInput,
  ValidateVoucherPayload,
  Voucher,
  VoucherStatus,
  VoucherValidationResult,
} from "@/types/voucher";

export const vouchersApi = {
  list(params: QueryVouchersParams = {}) {
    return apiClient.get<PaginatedVouchers>("/api/vouchers", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        scope: params.scope,
      },
    });
  },

  get(id: string) {
    return apiClient.get<Voucher>(`/api/vouchers/${id}`);
  },

  create(input: CreateVoucherInput) {
    return apiClient.post<Voucher>("/api/vouchers", input);
  },

  update(id: string, input: UpdateVoucherInput) {
    return apiClient.patch<Voucher>(`/api/vouchers/${id}`, input);
  },

  updateStatus(id: string, status: VoucherStatus) {
    return apiClient.patch<Voucher>(`/api/vouchers/${id}/status`, { status });
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/vouchers/${id}`);
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete<void>("/api/vouchers/bulk", { ids });
  },

  validate(input: ValidateVoucherPayload) {
    return apiClient.post<VoucherValidationResult>("/api/vouchers/validate", input);
  },
};
