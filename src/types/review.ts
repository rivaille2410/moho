import { ReviewCommentAuthor } from "./review-comment";

export type ReviewAuthor = {
  userId: string | null;
  name: string;
  avatarUrl: string | null;
  email: string | null;
  isRegisteredUser: boolean;
  memberSinceYears: number;
  reviewCount: number;
  thanksCount: number;
};

export type ReviewVariantInfo = {
  label: string;
  value: string;
  colorHex: string | null;
};

export type ReviewProduct = {
  name: string;
  slug: string;
  thumbnailUrl: string | null;
};

export type ReviewCommentPreview = {
  id: string;
  content: string;
  createdAt: string;
  author: ReviewCommentAuthor;
};

export type Review = {
  id: string;
  productId: string;
  product: ReviewProduct;
  rating: number;
  author: ReviewAuthor;
  content: string;
  images: string[];
  verifiedPurchase: boolean;
  variantInfo?: ReviewVariantInfo[];
  usedForLabel: string | null;
  helpfulCount: number;
  isHelpfulByCurrentUser: boolean;
  comments: ReviewCommentPreview[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewRatingSummary = {
  average: number;
  total: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CreateCustomerReviewInput = {
  rating: number;
  content: string;
  variantId?: string;
};

export type CreateReviewInput = {
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  content: string;
  variantId?: string;
  usedForLabel?: string;
  verifiedPurchase?: boolean;
};

export type UpdateReviewInput = {
  userId?: string;
  authorName?: string;
  rating?: number;
  content?: string;
  usedForLabel?: string;
  verifiedPurchase?: boolean;
};
