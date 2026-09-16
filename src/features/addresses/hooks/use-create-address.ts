import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Address, CreateAddressInput } from "@/types/address";

const ERROR_MESSAGES: Record<string, string> = {
  ADDRESS_LIMIT_REACHED: "Bạn chỉ có thể lưu tối đa 10 địa chỉ.",
};

async function createAddress(input: CreateAddressInput): Promise<Address> {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể thêm địa chỉ";
    throw new Error(message);
  }
  return data;
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.add({ type: "success", description: "Đã thêm địa chỉ mới" });
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
