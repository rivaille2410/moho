export type NotificationType =
  | "ORDER_CREATED"
  | "ORDER_STATUS_CHANGED"
  | "PAYMENT_AWAITING_CONFIRM"
  | "PRODUCT_LOW_STOCK"
  | "REVIEW_CREATED"
  | "COMMENT_CREATED";

export type NotificationAudience = "ADMIN" | "USER";

export interface Notification {
  id: string;
  type: NotificationType;
  audience: NotificationAudience;
  recipientId: string | null;
  title: string;
  message: string;
  link: string | null;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export type NotificationsResponse = Notification[];

export interface UnreadCountResponse {
  count: number;
}
