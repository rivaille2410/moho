import { useQuery } from "@tanstack/react-query";

import { Order } from "@/types/order";

async function getOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải thông tin đơn hàng");
  }
  return data;
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id as string),
    enabled: !!id,
  });
}
