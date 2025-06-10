
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from 'lucide-react';

interface InvoiceSearchProps {
  searchTerm: string;
  searchType: string;
  dateRange: string;
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onClearFilters: () => void;
}

const InvoiceSearch = ({
  searchTerm,
  searchType,
  dateRange,
  onSearchChange,
  onSearchTypeChange,
  onDateRangeChange,
  onClearFilters
}: InvoiceSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Search by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Fields</SelectItem>
          <SelectItem value="subscriberName">Subscriber Name</SelectItem>
          <SelectItem value="email">Email Address</SelectItem>
          <SelectItem value="phone">Phone Number</SelectItem>
          <SelectItem value="producerId">Producer ID</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline" onClick={onClearFilters}>
        <Filter className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
};

export default InvoiceSearch;
