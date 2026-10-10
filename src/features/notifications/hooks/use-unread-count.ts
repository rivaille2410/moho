import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications-api";
import { queryKeys } from "@/lib/query-keys";
import { UnreadCountResponse } from "@/types/notification";

export const useUnreadCount = () => {
  return useQuery<UnreadCountResponse>({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationsApi.unreadCount(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};
