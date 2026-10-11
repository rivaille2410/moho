import type { QueryClient } from "@tanstack/react-query";

export function invalidateOrderDashboardCaches(queryClient: QueryClient) {
  return Promise.all(
    [
      ["dashboard-stats"],
      ["dashboard-revenue-chart"],
      ["dashboard-order-status-distribution"],
      ["dashboard-top-products"],
      ["dashboard-top-customers"],
      ["dashboard-recent-orders"],
    ].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}
