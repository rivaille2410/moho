import { useQuery } from "@tanstack/react-query";

export interface VietQrBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
}

async function fetchVietQrBanks(): Promise<VietQrBank[]> {
  const res = await fetch("https://api.vietqr.io/v2/banks");
  const json = await res.json();
  return json.data as VietQrBank[];
}

export function useVietQrBanks() {
  return useQuery({
    queryKey: ["vietqr-banks"],
    queryFn: fetchVietQrBanks,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
