"use client";

import { useEffect, useSyncExternalStore } from "react";

export const BREADCRUMB_LOADING = "__breadcrumb_loading__";

let overrides: Record<string, string> = {};
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setBreadcrumbOverride(href: string, label: string) {
  overrides = { ...overrides, [href]: label };
  emitChange();
}

function clearBreadcrumbOverride(href: string) {
  if (!(href in overrides)) return;
  const { [href]: _removed, ...rest } = overrides;
  overrides = rest;
  emitChange();
}

export function useBreadcrumbOverrides() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => overrides,
    () => overrides,
  );
}

export function useBreadcrumbLabel(
  href: string,
  label: string | undefined,
  isLoading = false,
) {
  useEffect(() => {
    if (isLoading) {
      setBreadcrumbOverride(href, BREADCRUMB_LOADING);
      return;
    }

    if (label) {
      setBreadcrumbOverride(href, label);
    } else {
      clearBreadcrumbOverride(href);
    }

    return () => clearBreadcrumbOverride(href);
  }, [href, label, isLoading]);
}
