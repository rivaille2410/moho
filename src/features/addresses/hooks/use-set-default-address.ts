import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Address } from "@/types/address";
import { toast } from "@/components/ui/toast";

async function setDefaultAddress(id: string): Promise<Address> {
  const res = await fetch(`/api/addresses/${id}/default`, {
    method: "PATCH",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể đặt làm địa chỉ mặc định");
  }
  return data;
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.add({
        type: "success",
        description: "Đã đặt làm địa chỉ mặc định",
      });
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
