import { apiClient } from "@/lib/api-client";
import { AddressesResponse, Province, Ward } from "@/types/address";

export const addressesApi = {
  list() {
    return apiClient.get<AddressesResponse>("/api/addresses");
  },

  create(input: unknown) {
    return apiClient.post("/api/addresses", input);
  },

  update(id: string, input: unknown) {
    return apiClient.patch(`/api/addresses/${id}`, input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/addresses/${id}`);
  },

  setDefault(id: string) {
    return apiClient.patch<void>(`/api/addresses/${id}/default`);
  },

  provinces() {
    return apiClient.get<Province[]>("/api/addresses/provinces");
  },

  wards(provinceCode: number) {
    return apiClient.get<Ward[]>(`/api/addresses/provinces/${provinceCode}/wards`);
  },
};
