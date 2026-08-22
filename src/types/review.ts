export interface ReviewAuthor {
  userId: string | null;
  name: string;
  avatarUrl: string | null;
  isRegisteredUser: boolean;
  memberSinceYears: number;
  reviewCount: number;
  thanksCount: number;
}

export interface ReviewVariantInfo {
  label: string;
  value: string;
}

export interface ReviewProduct {
  name: string;
  slug: string;
}

export interface Review {
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
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRatingSummary {
  average: number;
  total: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateCustomerReviewInput {
  rating: number;
  content: string;
  variantId?: string;
}

export interface CreateReviewInput {
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  content: string;
  variantId?: string;
  usedForLabel?: string;
  verifiedPurchase?: boolean;
}

export interface UpdateReviewInput {
  userId?: string;
  authorName?: string;
  rating?: number;
  content?: string;
  usedForLabel?: string;
  verifiedPurchase?: boolean;
}
