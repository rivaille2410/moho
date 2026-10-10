import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications-api";
import { queryKeys } from "@/lib/query-keys";
import { NotificationsResponse } from "@/types/notification";

export const useNotifications = () => {
  return useQuery<NotificationsResponse>({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => notificationsApi.list(),
    staleTime: 30 * 1000,
  });
};
