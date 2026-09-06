import { SectionCards } from "../_components/section-cards";
import { ChartLowStock } from "../_components/chart-low-stock";
import { ChartOrdersBar } from "../_components/chart-orders-bar";
import { ChartTopProducts } from "../_components/chart-top-products";
import { ChartOrderStatus } from "../_components/chart-order-status";
import { TopCustomersList } from "../_components/top-customers-list";
import { ChartAreaInteractive } from "../_components/chart-area-interactive";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6">
          <SectionCards />
          <ChartAreaInteractive />
          <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-2">
            <ChartOrderStatus range="30d" />
            <TopCustomersList range="30d" limit={5} />
          </div>
          <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-2">
            <ChartOrdersBar range="30d" />
            <ChartTopProducts />
          </div>
          <ChartLowStock />
        </div>
      </div>
    </div>
  );
}
