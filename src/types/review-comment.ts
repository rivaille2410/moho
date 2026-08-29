export interface ReviewCommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  parentId: string | null;
  author: ReviewCommentAuthor;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies: ReviewComment[];
}

export interface CommentsResponse {
  data: ReviewComment[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
