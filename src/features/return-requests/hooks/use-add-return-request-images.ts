import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ReturnRequest } from "@/types/return-request";

async function addReturnRequestImages({
  id,
  files,
}: {
  id: string;
  files: File[];
}) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`/api/return-requests/${id}/images`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Không thể tải ảnh minh chứng");
  }
  return data as ReturnRequest;
}

export function useAddReturnRequestImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReturnRequestImages,
    onSuccess: (data) => {
      toast.add({ type: "success", description: "Đã thêm ảnh minh chứng" });
      queryClient.invalidateQueries({
        queryKey: ["my-return-requests", data.id],
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
