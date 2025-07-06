// components/DashboardSummary.tsx

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
} from '@/components/ui/command';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    onValueChange(newVal);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-md bg-white/70 shadow focus:ring-2 focus:ring-emerald-500 text-left px-4 h-9"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 max-h-56 overflow-y-auto rounded-md shadow-md border bg-white dark:bg-slate-800 z-50"
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
          <CommandGroup className="max-h-44 overflow-y-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-md"
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

interface DashboardSummaryProps {
  data: any[];
}

export function DashboardSummary({ data }: DashboardSummaryProps) {
  const expense = data.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const categoryTotals: { [key: string]: number } = {};
  data.forEach((tx) => {
    const cat = tx.category || 'Uncategorized';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (tx.amount || 0);
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center py-3 px-2">
        <CardContent className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            💸 Total Expense
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-white">
            ₹{expense.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {topCategory && (
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center py-3 px-2">
          <CardContent className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              🌟 Top Category
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
              {topCategory[0]}
            </p>
            <p className="text-md font-semibold text-slate-900 dark:text-white">
              ₹{topCategory[1].toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
