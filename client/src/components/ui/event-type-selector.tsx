import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, Check, ChevronDown } from "lucide-react";
import { eventTypes } from "@/lib/eventTypes";

export interface EventTypeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  buttonVariant?: "default" | "outline" | "ghost";
}

export function EventTypeSelector({ 
  value, 
  onChange, 
  className,
  buttonVariant = "outline" 
}: EventTypeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  
  const selectedEventType = React.useMemo(() => {
    if (!value) return null;
    return eventTypes.find(eventType => eventType.id === value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex items-center justify-between px-3",
            className
          )}
        >
          <div className="flex items-center space-x-2">
            {selectedEventType ? (
              <>
                <span className="mr-1">{selectedEventType.icon}</span>
                <span>{selectedEventType.name}</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Select Event Type</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search event types..." />
          <CommandList>
            <CommandEmpty>No event type found.</CommandEmpty>
            <CommandGroup heading="Event Types">
              {eventTypes.map((eventType) => (
                <CommandItem
                  key={eventType.id}
                  value={eventType.id}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className="mr-2">{eventType.icon}</span>
                  <span>{eventType.name}</span>
                  {eventType.id === value && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}