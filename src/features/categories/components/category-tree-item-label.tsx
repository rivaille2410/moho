import { Folder } from "lucide-react";

import { type FlattenedCategory } from "@/types/category";

interface CategoryTreeItemLabelProps {
  item: FlattenedCategory;
}

export function CategoryTreeItemLabel({ item }: CategoryTreeItemLabelProps) {
  return (
    <span className="flex h-5 min-w-0 items-center">
      {item.ancestorLines.map((showLine, i) => (
        <span key={i} className="relative h-5 w-4.5 shrink-0">
          {showLine && (
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
          )}
        </span>
      ))}

      {item.depth > 0 && (
        <span className="relative h-5 w-4.5 shrink-0">
          <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-border" />
          <span className="absolute left-1/2 top-1/2 h-px w-2.5 bg-border" />
          {!item.isLast && (
            <span className="absolute bottom-0 left-1/2 top-1/2 w-px -translate-x-1/2 bg-border" />
          )}
        </span>
      )}

      {item.depth === 0 && (
        <Folder className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
      )}

      <span
        className={
          item.depth === 0
            ? "truncate font-medium"
            : "truncate text-muted-foreground"
        }
      >
        {item.name}
      </span>
    </span>
  );
}
