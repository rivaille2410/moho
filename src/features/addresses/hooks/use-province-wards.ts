import { useQuery } from "@tanstack/react-query";

import { ProvinceDetail } from "@/types/address";

async function getProvinceWards(provinceCode: number): Promise<ProvinceDetail> {
  const res = await fetch(
    `https://provinces.open-api.vn/api/v2/p/${provinceCode}/?depth=2`,
  );

  if (!res.ok) {
    throw new Error("Không thể tải danh sách phường/xã");
  }

  return res.json();
}

export function useProvinceWards(provinceCode?: number) {
  return useQuery({
    queryKey: ["province-wards", provinceCode],
    queryFn: () => getProvinceWards(provinceCode as number),
    enabled: typeof provinceCode === "number",
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => data.wards,
  });
}
