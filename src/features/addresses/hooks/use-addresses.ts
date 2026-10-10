import { useQuery } from "@tanstack/react-query";
import { addressesApi } from "../api/addresses-api";
import { queryKeys } from "@/lib/query-keys";
import { AddressesResponse } from "@/types/address";

export function useAddresses() {
  return useQuery<AddressesResponse>({
    queryKey: queryKeys.addresses.list(),
    queryFn: () => addressesApi.list(),
  });
}
