import { useMemo } from "react";

import { type PublicCategory } from "@/types/product";

import { usePublicCategories } from "./use-public-categories";

export type CategoryMenuItem = {
  id: string;
  name: string;
  slug: string;
  href: string;
  children: CategoryMenuItem[];
};

const buildHref = (rootId: string | null, id: string) =>
  rootId
    ? `/products?categoryId=${rootId}&subCategoryId=${id}`
    : `/products?categoryId=${id}`;

export function buildCategoryMenu(
  categories: PublicCategory[],
): CategoryMenuItem[] {
  const byParent = new Map<string | null, PublicCategory[]>();

  for (const c of categories) {
    const key = c.parentId ?? null;
    const list = byParent.get(key);
    if (list) list.push(c);
    else byParent.set(key, [c]);
  }

  const walk = (
    parentId: string | null,
    rootId: string | null,
  ): CategoryMenuItem[] =>
    (byParent.get(parentId) ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      href: buildHref(rootId, c.id),
      children: walk(c.id, rootId ?? c.id),
    }));

  return walk(null, null);
}

export const useCategoryMenu = () => {
  const { data, isLoading, isError } = usePublicCategories();
  const items = useMemo(() => buildCategoryMenu(data ?? []), [data]);

  return { items, isLoading, isError };
};
