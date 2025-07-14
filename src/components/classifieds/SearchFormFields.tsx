
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedFilters } from '@/types/classifieds';
import CategoryDescriptionsDialog from './CategoryDescriptionsDialog';

interface SearchFormFieldsProps {
  filters: ClassifiedFilters;
  categories: Array<{ categoryId: string; name: string; active: boolean }>;
  maxMileOptions: number[];
  onFilterChange: (key: keyof ClassifiedFilters, value: string) => void;
  onClearFilters?: () => void;
  layout: 'main' | 'search';
}

const SearchFormFields = ({ 
  filters, 
  categories, 
  maxMileOptions, 
  onFilterChange, 
  onClearFilters,
  layout 
}: SearchFormFieldsProps) => {
  const isSearchLayout = layout === 'search';
  
  return (
    <>
      {/* First section: Basic filters */}
      <div className={isSearchLayout ? "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4" : "grid grid-cols-1 md:grid-cols-5 gap-4 mb-4"}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zip Code
          </label>
          <Input
            type="text"
            placeholder="Enter zip code"
            value={filters.zipCode || ''}
            onChange={(e) => onFilterChange('zipCode', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isSearchLayout ? 'Distance (Miles)' : 'Max Miles'}
          </label>
          <Select 
            value={filters.maxMiles?.toString() || 'all'} 
            onValueChange={(value) => onFilterChange('maxMiles', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Distance</SelectItem>
              {maxMileOptions.map((miles) => (
                <SelectItem key={miles} value={miles.toString()}>
                  {miles} miles
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <CategoryDescriptionsDialog />
          </div>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => onFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.categoryId} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Keywords field - positioning depends on layout */}
        {!isSearchLayout && (
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
        )}

        {/* Clear button for main layout */}
        {!isSearchLayout && onClearFilters && (
          <div className="flex items-end">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Keywords field for search layout */}
      {isSearchLayout && (
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
      )}
    </>
  );
};

export default SearchFormFields;
