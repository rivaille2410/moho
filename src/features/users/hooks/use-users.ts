import { useQuery } from "@tanstack/react-query";

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

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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

async function fetchUsers(params: QueryUsersParams): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.emailVerified !== undefined) {
    searchParams.set("emailVerified", String(params.emailVerified));
  }
  if (params.banned !== undefined) {
    searchParams.set("banned", String(params.banned));
  }

  const query = searchParams.toString();
  const res = await fetch(`/api/users${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export const useUsers = (params: QueryUsersParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    staleTime: 5 * 60 * 1000,
  });
};
