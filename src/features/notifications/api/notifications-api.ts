import { apiClient } from "@/lib/api-client";
import { NotificationsResponse, UnreadCountResponse } from "@/types/notification";

export const notificationsApi = {
  list() {
    return apiClient.get<NotificationsResponse>("/api/notifications");
  },

  unreadCount() {
    return apiClient.get<UnreadCountResponse>("/api/notifications/unread-count");
  },

  markAsRead(id: string) {
    return apiClient.patch<void>(`/api/notifications/${id}/read`);
  },

  markAllAsRead() {
    return apiClient.patch<void>("/api/notifications/read-all");
  },
};
