import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { Address, UpdateAddressInput } from "@/types/address";

const ERROR_MESSAGES: Record<string, string> = {
  DEFAULT_ADDRESS_REQUIRED:
    "Không thể bỏ chọn địa chỉ mặc định. Hãy đặt một địa chỉ khác làm mặc định.",
};

interface UpdateAddressParams {
  id: string;
  input: UpdateAddressInput;
}

async function updateAddress({
  id,
  input,
}: UpdateAddressParams): Promise<Address> {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể cập nhật địa chỉ";
    throw new Error(message);
  }
  return data;
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.add({ type: "success", description: "Đã cập nhật địa chỉ" });
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
