import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvoiceDateRangeSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSearch: () => void;
  onDirectSearch: (dates: { startDate: string; endDate: string }) => void;
  producerId: string;
}

const QUICK_RANGES = [
  { label: '1M', months: 1, full: 'Last month' },
  { label: '3M', months: 3, full: 'Last 3 months' },
  { label: '6M', months: 6, full: 'Last 6 months' },
  { label: '12M', months: 12, full: 'Last 12 months' },
];

const InvoiceDateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onDirectSearch,
}: InvoiceDateRangeSelectorProps) => {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
  const hasFullRange = Boolean(startDate && endDate);

  const isActiveQuickRange = (months: number) => {
    if (!startDate || !endDate) return false;
    const diffMs = endDate.getTime() - startDate.getTime();
    const approx = months * 30.44 * 24 * 60 * 60 * 1000;
    return Math.abs(diffMs - approx) < 3 * 24 * 60 * 60 * 1000;
  };

  const handleQuickRange = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    onStartDateChange(start);
    onEndDateChange(end);

    onDirectSearch({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });
  };

  const handleRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    onStartDateChange(range?.from);
    onEndDateChange(range?.to);
  };

  return (
    <Card className="border-border/80 shadow-sm overflow-hidden">
      <div className="border-b bg-gradient-to-r from-accent/40 to-transparent px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Billing period</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose a preset or pick a custom range to view matching invoices.
            </p>
          </div>
          <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm">
            {QUICK_RANGES.map(({ label, months, full }) => {
              const active = isActiveQuickRange(months);
              return (
                <button
                  key={months}
                  type="button"
                  onClick={() => handleQuickRange(months)}
                  title={full}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <CardContent className="px-6 py-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-stretch">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "group flex-1 flex items-center gap-3 rounded-lg border bg-background px-4 py-3 text-left transition-all",
                  "hover:border-primary/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  hasFullRange ? "border-primary/40" : "border-input"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                  hasFullRange ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Invoice period
                  </div>
                  <div className={cn(
                    "text-sm font-semibold mt-0.5 truncate",
                    hasFullRange ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {startDate && endDate
                      ? `${format(startDate, 'MMM d, yyyy')}  →  ${format(endDate, 'MMM d, yyyy')}`
                      : startDate
                        ? `${format(startDate, 'MMM d, yyyy')}  →  Select end date`
                        : 'Select a date range'}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-xl border shadow-lg overflow-hidden"
              align="start"
              sideOffset={8}
            >
              <Calendar
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={handleRangeSelect}
                numberOfMonths={isMobile ? 1 : 2}
                captionLayout="dropdown"
                startMonth={new Date(currentYear - 10, 0)}
                endMonth={new Date(currentYear, 11)}
                defaultMonth={startDate ?? new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={onSearch}
            disabled={!hasFullRange}
            size="lg"
            className="md:w-auto md:px-8 gap-2"
          >
            <Search className="h-4 w-4" />
            Search invoices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDateRangeSelector;
