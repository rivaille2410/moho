import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { CreateShipmentInput } from "@/types/shipment";
import { shipmentsApi } from "../api/shipments-api";

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateShipmentInput) => shipmentsApi.create(input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo vận đơn mới" });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.shipments.shippableOrders(),
      });
    },
  });
}
