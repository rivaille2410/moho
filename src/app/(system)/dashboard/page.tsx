import data from "./data.json";

import { DataTable } from "../_components/data-table";
import { SectionCards } from "../_components/section-cards";
import { ChartAreaInteractive } from "../_components/chart-area-interactive";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6">
          <SectionCards />
          <ChartAreaInteractive />
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
