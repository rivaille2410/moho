export * from "./error-messages";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE_SIZE_OPTIONS: [10, 20, 30, 50],
} as const;

export const DATE_FORMATS = {
  DISPLAY_DATE: "dd/MM/yyyy",
  DISPLAY_DATETIME: "HH:mm - dd/MM/yyyy",
} as const;
