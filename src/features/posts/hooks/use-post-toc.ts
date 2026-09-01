"use client";

import { useEffect, useState, type RefObject } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function usePostToc(
  contentRef: RefObject<HTMLDivElement | null>,
  deps: unknown[],
) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll<HTMLElement>("h2, h3"),
    );

    const usedIds = new Set<string>();
    const items: TocItem[] = headings.map((heading) => {
      const base = slugify(heading.textContent ?? "") || "section";
      let id = base;
      let i = 1;
      while (usedIds.has(id)) {
        id = `${base}-${i++}`;
      }
      usedIds.add(id);
      heading.id = id;

      return {
        id,
        text: heading.textContent ?? "",
        level: heading.tagName === "H2" ? 2 : 3,
      };
    });

    setToc(items);
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, deps);

  return { toc, activeId };
}
