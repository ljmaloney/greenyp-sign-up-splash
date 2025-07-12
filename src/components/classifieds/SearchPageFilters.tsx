
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClassifiedFilters } from '@/types/classifieds';
import { Search } from 'lucide-react';
import FilterControls from './FilterControls';

interface SearchPageFiltersProps {
  filters: ClassifiedFilters;
  onFilterChange: (key: keyof ClassifiedFilters, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  hasChanges: boolean;
}

const SearchPageFilters = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onClearFilters, 
  hasChanges 
}: SearchPageFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* First line: Zip Code, Max Miles, Category */}
        <div className="mb-4">
          <FilterControls 
            filters={filters}
            onFilterChange={onFilterChange}
            layout="horizontal"
          />
        </div>

        {/* Second line: Search Keywords */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Keywords
          </label>
          <Input
            type="text"
            placeholder="Search by title"
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
          />
        </div>

        {/* Third line: Apply Filter and Clear Filters buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onApplyFilters}
            className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8"
            disabled={!hasChanges}
          >
            <Search className="w-4 h-4 mr-2" />
            Apply Filter
          </Button>
          <Button 
            variant="outline" 
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchPageFilters;
