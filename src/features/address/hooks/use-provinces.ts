import { useQuery } from "@tanstack/react-query";

import { Province } from "@/types/address";

async function getProvinces(): Promise<Province[]> {
  const res = await fetch("https://provinces.open-api.vn/api/v2/p/");

  if (!res.ok) {
    throw new Error("Không thể tải danh sách tỉnh/thành");
  }

  return res.json();
}

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
