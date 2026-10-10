"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { mediaApi } from "../api/media-api";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => mediaApi.uploadImage(file),
    onError: (error: Error) => {
      toast.add({
        type: "error",
        description: error.message,
        priority: "high",
      });
    },
  });
}
