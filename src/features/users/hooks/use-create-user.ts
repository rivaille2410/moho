import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
  password: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_IN_USE: "Email này đã được sử dụng.",
};

async function createUser(input: CreateUserInput) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data?.code && ERROR_MESSAGES[data.code]) ??
      data?.message ??
      "Không thể tạo người dùng";
    throw new Error(message);
  }
  return data;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.add({ type: "success", description: "Đã tạo người dùng mới" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
