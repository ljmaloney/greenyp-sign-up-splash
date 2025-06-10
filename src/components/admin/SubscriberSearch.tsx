
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface SubscriberSearchProps {
  searchTerm: string;
  searchType: string;
  sortBy: string;
  showRecent: boolean;
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onRecentToggle: () => void;
}

const SubscriberSearch = ({
  searchTerm,
  searchType,
  sortBy,
  showRecent,
  onSearchChange,
  onSearchTypeChange,
  onSortByChange,
  onRecentToggle
}: SubscriberSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search subscribers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Search by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Fields</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="address">Address</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="joinDate">Join Date</SelectItem>
          <SelectItem value="lastActivity">Last Activity</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={showRecent ? "default" : "outline"}
        onClick={onRecentToggle}
      >
        <Filter className="h-4 w-4 mr-2" />
        Recent (30d)
      </Button>
    </div>
  );
};

export default SubscriberSearch;
