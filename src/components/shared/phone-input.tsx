"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> {
  value?: string;
  onChange: (value: string) => void;
}

export function PhoneInput({
  value,
  onChange,
  className,
  placeholder = "Nhập số điện thoại",
  ...props
}: PhoneInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r px-3 text-sm text-muted-foreground">
        +84
      </span>
      <Input
        {...props}
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => {
          const digitsOnly = e.target.value
            .replace(/\D/g, "")
            .replace(/^0+/, "");
          onChange(digitsOnly.slice(0, 9));
        }}
        placeholder={placeholder}
        className={cn("pl-14", className)}
      />
    </div>
  );
}
