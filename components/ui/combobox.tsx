// components/ui/combobox.tsx

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Button } from './button';

interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = 'Search or type category',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (selected: string) => {
    onValueChange(selected);
    setOpen(false);
  };

  const handleInputChange = (newVal: string) => {
    setInputValue(newVal);
    onValueChange(newVal); // allows free text input
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-full bg-white/60 shadow-inner focus:ring-2 focus:ring-emerald-500 text-left px-4 h-10"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 max-h-60 overflow-y-auto rounded-xl shadow-xl border bg-white dark:bg-slate-800 z-50"
        side="bottom"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={inputValue}
            onValueChange={handleInputChange}
            placeholder="Search or type category"
            className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2"
          />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 text-emerald-600',
                    value === option ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
