import { apiClient } from "@/lib/api-client";
import {
  CategoryListItem,
  QueryCategoriesParams,
  CreateCategoryInput,
  UpdateCategoryInput,
  BulkDeleteCategoriesResponse,
} from "@/types/category";

export const categoriesApi = {
  list(params: QueryCategoriesParams = {}) {
    return apiClient.get<CategoryListItem[]>("/api/categories", {
      params: {
        search: params.search,
        parentId: params.parentId,
        rootOnly: params.rootOnly,
      },
    });
  },

  get(id: string) {
    return apiClient.get<CategoryListItem>(`/api/categories/${id}`);
  },

  create(input: CreateCategoryInput) {
    return apiClient.post<CategoryListItem>("/api/categories", input);
  },

  update(id: string, input: UpdateCategoryInput) {
    return apiClient.patch<CategoryListItem>(`/api/categories/${id}`, input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/categories/${id}`);
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete<BulkDeleteCategoriesResponse>("/api/categories/bulk", { ids });
  },
};
