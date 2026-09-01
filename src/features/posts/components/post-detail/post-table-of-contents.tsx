"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { type TocItem } from "@/features/posts/hooks/use-post-toc";

interface Props {
  toc: TocItem[];
  activeId: string;
}

export function PostTableOfContents({ toc, activeId }: Props) {
  if (toc.length === 0) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
      <p className="mb-3 text-xl font-semibold">Mục lục</p>
      <ul className="space-y-1 border-l text-sm">
        {toc.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 transition",
                item.level === 3 && "pl-6",
                activeId === item.id
                  ? "border-secondary font-medium text-secondary"
                  : "border-transparent text-muted-foreground hover:text-secondary",
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
