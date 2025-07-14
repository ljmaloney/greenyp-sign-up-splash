
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ClassifiedFilters } from '@/types/classifieds';
import SearchFormFields from './SearchFormFields';

interface SearchFormSearchLayoutProps {
  filters: ClassifiedFilters;
  categories: Array<{ categoryId: string; name: string; active: boolean }>;
  maxMileOptions: number[];
  onFilterChange: (key: keyof ClassifiedFilters, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearFilters: () => void;
}

const SearchFormSearchLayout = ({ 
  filters, 
  categories, 
  maxMileOptions, 
  onFilterChange, 
  onSubmit, 
  onClearFilters 
}: SearchFormSearchLayoutProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={onSubmit}>
          <SearchFormFields 
            filters={filters}
            categories={categories}
            maxMileOptions={maxMileOptions}
            onFilterChange={onFilterChange}
            layout="search"
          />

          {/* Button section for search layout */}
          <div className="flex justify-center gap-4">
            <Button 
              type="submit"
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchFormSearchLayout;
