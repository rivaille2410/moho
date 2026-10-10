import { apiClient } from "@/lib/api-client";
import {
  CreateProductInput,
  ProductsResponse,
  QueryProductsParams,
  UpdateProductInput,
  ProductStatus,
  ProductVariant,
  ProductImage,
} from "@/types/product";

export const productsApi = {
  list(params: QueryProductsParams = {}) {
    return apiClient.get<ProductsResponse>("/api/products", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        categoryId: params.categoryId,
        outOfStock: params.outOfStock,
      },
    });
  },

  get(id: string) {
    return apiClient.get(`/api/products/${id}`);
  },

  create(input: CreateProductInput) {
    return apiClient.post("/api/products", input);
  },

  update(id: string, input: UpdateProductInput) {
    return apiClient.patch(`/api/products/${id}`, input);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/api/products/${id}`);
  },

  updateStatus(id: string, status: ProductStatus) {
    return apiClient.patch(`/api/products/${id}/status`, { status });
  },

  bulkDelete(ids: string[]) {
    return apiClient.delete("/api/products/bulk", { ids });
  },

  // Variants
  getVariants(productId: string) {
    return apiClient.get<ProductVariant[]>(`/api/products/${productId}/variants`);
  },

  addVariant(productId: string, input: unknown) {
    return apiClient.post<ProductVariant>(`/api/products/${productId}/variants`, input);
  },

  updateVariant(productId: string, variantId: string, input: unknown) {
    return apiClient.patch<ProductVariant>(`/api/products/${productId}/variants/${variantId}`, input);
  },

  removeVariant(productId: string, variantId: string) {
    return apiClient.delete<void>(`/api/products/${productId}/variants/${variantId}`);
  },

  // Images
  addImage(productId: string, formData: FormData) {
    return apiClient.post<ProductImage>(`/api/products/${productId}/images`, formData);
  },

  removeImage(productId: string, imageId: string) {
    return apiClient.delete<void>(`/api/products/${productId}/images/${imageId}`);
  },

  removeImages(productId: string, imageIds: string[]) {
    return apiClient.delete<void>(`/api/products/${productId}/images`, { imageIds });
  },

  setThumbnail(productId: string, imageId: string) {
    return apiClient.patch<void>(`/api/products/${productId}/images/${imageId}/thumbnail`);
  },
};
