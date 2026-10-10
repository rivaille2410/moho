import { apiClient } from "@/lib/api-client";
import { Post, PostsResponse, QueryPostsParams } from "@/types/post";
import type { RequestOptions } from "@/lib/api-client";

export const postsApi = {
  list(params: QueryPostsParams = {}) {
    return apiClient.get<PostsResponse>("/api/posts", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
      },
    });
  },

  get(id: string) {
    return apiClient.get<Post>(`/api/posts/${id}`);
  },

  create(input: unknown) {
    return apiClient.post<Post>("/api/posts", input);
  },

  update(id: string, input: unknown) {
    return apiClient.patch<Post>(`/api/posts/${id}`, input);
  },

  updateStatus(id: string, status: string) {
    return apiClient.patch<Post>(`/api/posts/${id}/status`, { status });
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/posts/${id}`);
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete<void>("/api/posts/bulk", { ids });
  },

  publicList(
    params: QueryPostsParams = {},
    options?: Pick<RequestOptions, "signal">,
  ) {
    return apiClient.get<PostsResponse>("/api/public/posts", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        sortBy: params.sortBy,
      },
      ...options,
    });
  },

  publicDetail(slug: string, options?: Pick<RequestOptions, "signal">) {
    return apiClient.get<Post>(`/api/public/posts/${encodeURIComponent(slug)}`, options);
  },
};
