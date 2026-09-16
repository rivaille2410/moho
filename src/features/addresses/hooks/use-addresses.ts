import { useQuery } from "@tanstack/react-query";

import { AddressesResponse } from "@/types/address";

async function fetchAddresses(): Promise<AddressesResponse> {
  const res = await fetch("/api/addresses");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải danh sách địa chỉ");
  }
  return data;
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
  });
}
