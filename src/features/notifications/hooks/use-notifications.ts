import { useQuery } from "@tanstack/react-query";

import { NotificationsResponse } from "@/types/notification";

async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch("/api/notifications", { method: "GET" });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 30 * 1000,
  });
};
