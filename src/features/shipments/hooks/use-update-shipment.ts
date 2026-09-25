import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Shipment, UpdateShipmentInput } from "@/types/shipment";

async function updateShipment({
  id,
  input,
}: {
  id: string;
  input: UpdateShipmentInput;
}): Promise<Shipment> {
  const res = await fetch(`/api/shipments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể cập nhật vận đơn");
  }
  return data;
}

export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShipment,
    onSuccess: (_data, { id }) => {
      toast.add({ type: "success", description: "Đã cập nhật vận đơn" });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipments", id] });
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
