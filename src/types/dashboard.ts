export type DashboardRange = "7d" | "30d" | "90d";

export interface MetricWithChange {
  value: number;
  changePercent: number;
}

export interface DashboardStats {
  range: DashboardRange;
  revenue: MetricWithChange;
  newOrders: MetricWithChange;
  newCustomers: MetricWithChange;
  pendingOrders: { value: number };
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  soldCount: number;
  thumbnailUrl: string | null;
}

export interface LowStockVariant {
  variantId: string;
  variantName: string;
  colorName: string | null;
  stock: number;
  productId: string;
  productName: string;
  sku: string;
}

export interface ActiveVoucher {
  id: string;
  code: string;
  name: string;
  type: "PERCENT" | "FIXED";
  value: number;
  usedCount: number;
  usageLimit: number | null;
  totalDiscountApplied: number;
}

export interface DashboardRangeParams {
  range?: DashboardRange;
}

export interface TopProductsParams {
  limit?: number;
}

export interface LowStockParams {
  threshold?: number;
  limit?: number;
}

export interface OrderStatusDistributionItem {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  count: number;
  percentage: number;
}

export interface OrderStatusDistribution {
  range: DashboardRange;
  total: number;
  cancelledCount: number;
  cancellationRate: number;
  distribution: OrderStatusDistributionItem[];
}

export interface RecentOrderCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  total: number;
  paymentMethod: "COD" | "BANK_TRANSFER";
  createdAt: string;
  customer: RecentOrderCustomer;
}

export interface TopCustomer {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  totalSpent: number;
  orderCount: number;
}

export interface RecentOrdersParams {
  limit?: number;
}

export interface TopCustomersParams extends DashboardRangeParams {
  limit?: number;
}
