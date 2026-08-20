import { useQuery } from "@tanstack/react-query";

import { CategoryTreeNode, FlattenedCategory } from "@/types/category";

async function fetchCategoryTree(): Promise<CategoryTreeNode[]> {
  const res = await fetch("/api/categories/tree", { method: "GET" });

  if (!res.ok) {
    throw new Error("Failed to fetch category tree");
  }

  return res.json();
}

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: fetchCategoryTree,
    staleTime: 5 * 60 * 1000,
  });
};

export function flattenCategoryTree(
  nodes: CategoryTreeNode[],
  depth = 0,
  ancestorLines: boolean[] = [],
): FlattenedCategory[] {
  return nodes.flatMap((node, index) => {
    const isLast = index === nodes.length - 1;

    const childAncestorLines = depth === 0 ? [] : [...ancestorLines, !isLast];

    return [
      { id: node.id, name: node.name, depth, isLast, ancestorLines },
      ...flattenCategoryTree(node.children, depth + 1, childAncestorLines),
    ];
  });
}
