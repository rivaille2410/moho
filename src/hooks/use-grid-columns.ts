"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS = [
  { minWidth: 1536, columns: 6 },
  { minWidth: 1280, columns: 5 },
  { minWidth: 1024, columns: 4 },
  { minWidth: 640, columns: 3 },
  { minWidth: 0, columns: 2 },
];

function getColumns(width: number) {
  return BREAKPOINTS.find((bp) => width >= bp.minWidth)?.columns ?? 2;
}

export function useGridColumns() {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const update = () => setColumns(getColumns(window.innerWidth));
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
}
