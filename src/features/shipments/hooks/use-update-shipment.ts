import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { UpdateShipmentInput } from "@/types/shipment";
import { shipmentsApi } from "../api/shipments-api";

export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateShipmentInput }) =>
      shipmentsApi.update(id, input),
    onSuccess: (_data, { id }) => {
      toast.add({ type: "success", description: "Đã cập nhật vận đơn" });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments.detail(id) });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
