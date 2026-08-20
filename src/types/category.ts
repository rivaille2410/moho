export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  productCount: number;
  childrenCount: number;
  createdAt: string;
  updatedAt: string;
};

export type QueryCategoriesParams = {
  search?: string;
  parentId?: string;
  rootOnly?: boolean;
};

export type CategoryTreeNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryTreeNode[];
};

export type FlattenedCategory = {
  id: string;
  name: string;
  depth: number;
  isLast: boolean;
  ancestorLines: boolean[];
};

export type CreateCategoryInput = {
  name: string;
  parentId?: string;
};

export type UpdateCategoryArgs = {
  id: string;
  input: Partial<CreateCategoryInput>;
};

export type BulkDeleteCategoriesResponse = {
  deletedCount: number;
  deletedIds: string[];
  skipped: { id: string; reason: string }[];
};
