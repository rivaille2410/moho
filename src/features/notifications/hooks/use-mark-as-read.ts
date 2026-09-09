import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Notification } from "@/types/notification";

async function markAsRead(id: string): Promise<Notification> {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return res.json();
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
