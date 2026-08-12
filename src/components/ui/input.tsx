"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  startIcon,
  endIcon,
  ...props
}: React.ComponentProps<"input"> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const input = (
    <InputPrimitive
      type={resolvedType}
      data-slot="input"
      spellCheck={false}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        startIcon && "pl-8",
        (endIcon || isPassword) && "pr-8",
        className,
      )}
      {...props}
    />
  );

  if (!startIcon && !endIcon && !isPassword) {
    return input;
  }

  return (
    <div className="group/input relative">
      {startIcon && (
        <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/input:text-primary [&_svg]:size-4">
          {startIcon}
        </span>
      )}
      {input}
      {isPassword ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-secondary focus-visible:text-primary [&_svg]:size-4.5"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      ) : (
        endIcon && (
          <span className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/input:text-primary [&_svg]:size-4">
            {endIcon}
          </span>
        )
      )}
    </div>
  );
}

export { Input };
