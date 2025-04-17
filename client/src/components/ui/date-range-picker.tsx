import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarDateRangePickerProps {
  date: DateRange;
  setDate: (date: DateRange) => void;
  className?: string;
}

export function CalendarDateRangePicker({
  date,
  setDate,
  className,
}: CalendarDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Create a list of preset date ranges
  const presets = [
    { name: "Last 7 days", range: { from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() } },
    { name: "Last 30 days", range: { from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() } },
    { name: "Last 90 days", range: { from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), to: new Date() } },
    { name: "This month", range: getMonthRange(0) },
    { name: "Last month", range: getMonthRange(1) },
    { name: "This year", range: getYearRange(0) },
  ];

  // Helper function to get month range
  function getMonthRange(monthsAgo: number) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const end = monthsAgo === 0 
      ? new Date() 
      : new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0);
    return { from: start, to: end };
  }

  // Helper function to get year range
  function getYearRange(yearsAgo: number) {
    const now = new Date();
    const start = new Date(now.getFullYear() - yearsAgo, 0, 1);
    const end = yearsAgo === 0 ? new Date() : new Date(now.getFullYear() - yearsAgo, 11, 31);
    return { from: start, to: end };
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            <div className="p-3 border-r">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Presets</h4>
                <div className="flex flex-col gap-1">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        setDate(preset.range);
                        setIsOpen(false);
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-l">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) setDate(newDate);
                }}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}