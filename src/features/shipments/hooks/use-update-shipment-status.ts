import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { Shipment, UpdateShipmentStatusInput } from "@/types/shipment";
import { shipmentsApi } from "../api/shipments-api";

interface UpdateShipmentStatusParams {
  id: string;
  input: UpdateShipmentStatusInput;
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation<Shipment, Error, UpdateShipmentStatusParams>({
    mutationFn: ({ id, input }) => shipmentsApi.updateStatus(id, input),
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã cập nhật trạng thái" });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all });
    },
  });
}
