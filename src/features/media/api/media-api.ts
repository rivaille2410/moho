import { apiClient } from "@/lib/api-client";

export const mediaApi = {
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{ url: string }>("/api/uploads", formData);
  },
};
