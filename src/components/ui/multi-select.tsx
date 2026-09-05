"use client";

import { useMemo, useState } from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  maxVisibleChips?: number;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  emptyText = "Không tìm thấy kết quả.",
  className,
  maxVisibleChips = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  const orderedOptions = useMemo(() => {
    const selected = options.filter((o) => value.includes(o.value));
    const rest = options.filter((o) => !value.includes(o.value));
    return [...selected, ...rest];
  }, [options, value]);

  const visibleChips = selectedOptions.slice(0, maxVisibleChips);
  const overflowCount = selectedOptions.length - visibleChips.length;

  const toggleValue = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-9 w-full justify-between px-3 font-normal",
              className,
            )}
          >
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex min-w-0 items-center gap-1.5">
                {visibleChips.map((option) => (
                  <Badge
                    key={option.value}
                    className="gap-1 text-secondary bg-secondary/10 pl-2.5 pr-1"
                  >
                    <span className="max-w-28 truncate">{option.label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => removeValue(option.value, e)}
                      className="rounded-full p-1 hover:bg-secondary/20 transition"
                    >
                      <X className="size-3" />
                    </span>
                  </Badge>
                ))}
                {overflowCount > 0 && (
                  <Badge variant="secondary">+{overflowCount}</Badge>
                )}
              </div>
            )}
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        }
      />
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <div className="flex items-center justify-between border-b px-1">
            <CommandInput
              placeholder="Tìm kiếm..."
              className="h-9 flex-1 border-0"
            />
            {selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="mr-2 shrink-0 text-xs text-muted-foreground hover:text-destructive transition"
              >
                Xoá tất cả
              </button>
            )}
          </div>

          {selectedOptions.length > 0 && (
            <div className="border-b px-3 py-1.5 text-xs text-muted-foreground">
              Đã chọn {selectedOptions.length}
              {options.length > 0 && ` / ${options.length}`}
            </div>
          )}

          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {orderedOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggleValue(option.value)}
                    className="gap-2"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input",
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
