
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClassifiedFilters } from '@/types/classifieds';
import { Search } from 'lucide-react';
import FilterControls from './FilterControls';

interface MainPageFiltersProps {
  filters: ClassifiedFilters;
  onFilterChange: (key: keyof ClassifiedFilters, value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

const MainPageFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearFilters 
}: MainPageFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-3">
            <FilterControls 
              filters={filters}
              onFilterChange={onFilterChange}
              layout="vertical"
            />
          </div>

          <div>
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

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onSearch}
            className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Classifieds
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainPageFilters;
