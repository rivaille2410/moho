export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
  isThumbnail: boolean;
};

export type ProductMaterial = {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  colorHex: string | null;
  priceOverride: number | null;
  stock: number;
  sortOrder: number;
  images: ProductImage[];
};

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  categoryId: string;
  status: ProductStatus;
  soldCount: number;
  totalStock: number;
  materials: ProductMaterial[];
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ProductsResponse = {
  data: ProductListItem[];
  meta: PaginationMeta;
};

export type QueryProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  categoryId?: string;
  outOfStock?: boolean;
};

export type CreateProductMaterialInput = {
  label: string;
  value: string;
  sortOrder?: number;
};

export type CreateProductVariantInput = {
  name: string;
  colorHex?: string;
  priceOverride?: number;
  stock: number;
  sortOrder?: number;
};

export type CreateProductInput = {
  name: string;
  sku: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  length?: number;
  width?: number;
  height?: number;
  categoryId: string;
  status?: ProductStatus;
  materials?: CreateProductMaterialInput[];
  variants?: CreateProductVariantInput[];
};

export type VariantPayload = {
  name: string;
  stock: number;
  sortOrder?: number;
  colorHex?: string | null;
  priceOverride?: number | null;
};

export type AddVariantArgs = {
  productId: string;
  payload: VariantPayload;
};

export type UpdateVariantArgs = {
  productId: string;
  variantId: string;
  input: Partial<CreateProductVariantInput>;
};

export type UpdateProductPayload = {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  categoryId?: string;
  status?: ProductStatus;
  materials?: { label: string; value: string; sortOrder?: number }[];
};

export type UpdateProductArgs = {
  id: string;
  payload: UpdateProductPayload;
};

export type UpdateProductStatusInput = {
  id: string;
  status: ProductStatus;
};

export type RemoveVariantArgs = {
  productId: string;
  variantId: string;
};

export type RemoveProductImageArgs = {
  productId: string;
  imageId: string;
};
