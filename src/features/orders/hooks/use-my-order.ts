import { useQuery } from "@tanstack/react-query";

import { Order } from "@/types/order";

async function getMyOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/me/${id}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải thông tin đơn hàng");
  }
  return data;
}

export function useMyOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["my-order", id],
    queryFn: () => getMyOrder(id as string),
    enabled: !!id,
  });
}
