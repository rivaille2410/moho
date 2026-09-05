"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { blockNegativeKeys } from "@/lib/input-guards";

function formatThousands(digits: string) {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

interface CurrencyInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  suffix?: string;
}

export function CurrencyInput({
  value,
  onChange,
  suffix = "đ",
  className,
  onKeyDown,
  ...props
}: CurrencyInputProps) {
  const [display, setDisplay] = React.useState(() =>
    value !== undefined && value !== null ? formatThousands(String(value)) : "",
  );

  React.useEffect(() => {
    setDisplay(
      value !== undefined && value !== null
        ? formatThousands(String(value))
        : "",
    );
  }, [value]);

  return (
    <div className="relative">
      <Input
        inputMode="numeric"
        className={cn("pr-9", className)}
        value={display}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/\D/g, "");
          const formatted = formatThousands(digitsOnly);
          setDisplay(formatted);
          onChange(digitsOnly ? Number(digitsOnly) : undefined);
        }}
        onKeyDown={(e) => {
          blockNegativeKeys(e);
          onKeyDown?.(e);
        }}
        {...props}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}
