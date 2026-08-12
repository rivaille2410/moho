import {
  sortFn_text,
  tableFeatures,
  rowSortingFeature,
  rowSelectionFeature,
  sortFn_alphanumeric,
  createSortedRowModel,
  columnVisibilityFeature,
} from "@tanstack/react-table";

export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

export type DataTableFeatures = typeof dataTableFeatures;
