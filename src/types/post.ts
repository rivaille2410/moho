export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CreatePostInput {
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  content: string;
  status?: PostStatus;
}

export type UpdatePostInput = Partial<CreatePostInput>;

export interface UpdatePostArgs {
  id: string;
  payload: UpdatePostInput;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  status: PostStatus;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
}

export interface Post extends PostListItem {
  content: string;
  updatedAt: string;
}

export interface PostsMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PostsResponse {
  data: PostListItem[];
  meta: PostsMeta;
}

export interface QueryPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
}
