import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { useApiClient } from '@/hooks/useApiClient';
import { createInvoiceService } from '@/services/invoiceService';

interface InvoiceDateRangeSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSearch: () => void;
  onDirectSearch: (dates: { startDate: string; endDate: string }) => void;
  producerId: string;
}

const InvoiceDateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onDirectSearch,
  producerId
}: InvoiceDateRangeSelectorProps) => {

  const handleQuickRange = (months: number) => {
    console.log(`BUTTON CLICKED: Last ${months} Months`);

    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    console.log(`DATE RANGE SET: ${startDateStr} to ${endDateStr}`);
    console.log(`CALLING API WITH PRODUCER ID: ${producerId}`);

    onStartDateChange(start);
    onEndDateChange(end);

    // DIRECTLY CALL THE FUCKING ENDPOINT
    onDirectSearch({
      startDate: startDateStr,
      endDate: endDateStr
    });

    console.log('API CALL TRIGGERED');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickRange(1)}
          >
            Last Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickRange(3)}
          >
            Last 3 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickRange(6)}
          >
            Last 6 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickRange(12)}
          >
            Last 12 Months
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={onSearch} 
              disabled={!startDate || !endDate}
              className="w-full md:w-auto"
            >
              Search Invoices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDateRangeSelector;