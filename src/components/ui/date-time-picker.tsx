"use client";

import * as React from "react";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

function toDateTimeLocalString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const date = value ? new Date(value) : undefined;

  const handleSelectDate = (selected: Date | undefined) => {
    if (!selected) return;
    const next = new Date(selected);

    if (date) {
      next.setHours(date.getHours(), date.getMinutes());
    } else {
      const now = new Date();
      next.setHours(now.getHours(), now.getMinutes());
    }

    onChange(toDateTimeLocalString(next));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const base = date ?? new Date();
    const next = new Date(base);
    next.setHours(hours || 0, minutes || 0);
    onChange(toDateTimeLocalString(next));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            data-empty={!date}
            className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="size-4" />
        {date ? format(date, "dd/MM/yyyy HH:mm") : <span>{placeholder}</span>}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
          disabled={disabled}
          locale={vi}
        />

        <div className="border-t p-3">
          <Input
            type="time"
            value={date ? format(date, "HH:mm") : ""}
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
