import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users-api";
import { queryKeys } from "@/lib/query-keys";
import { PaginationMeta } from "@/types/shared";

export interface UserListItem {
  id: string;
  name: string;
  role: string;
  email: string;
  createdAt: string;
  avatar: string | null;
  emailVerified: boolean;
  bannedAt: string | null;
}

export interface UsersResponse {
  data: UserListItem[];
  meta: PaginationMeta;
}

export interface QueryUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  emailVerified?: boolean;
  banned?: boolean;
}

export const useUsers = (params: QueryUsersParams = {}) => {
  return useQuery<UsersResponse>({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.list(params),
    staleTime: 5 * 60 * 1000,
  });
};
