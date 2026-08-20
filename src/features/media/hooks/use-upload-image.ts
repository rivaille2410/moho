"use client";

import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

interface UploadImageResponse {
  url: string;
}

async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`/api/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Không thể tải ảnh lên");
  }

  return res.json();
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
