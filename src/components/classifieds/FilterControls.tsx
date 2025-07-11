
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedFilters } from '@/types/classifieds';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import CategoryDescriptionsDialog from './CategoryDescriptionsDialog';

interface FilterControlsProps {
  filters: ClassifiedFilters;
  onFilterChange: (key: keyof ClassifiedFilters, value: string) => void;
  layout?: 'horizontal' | 'vertical';
}

const FilterControls = ({ filters, onFilterChange, layout = 'horizontal' }: FilterControlsProps) => {
  const { data: categoriesData } = useClassifiedCategories();
  const categories = categoriesData?.response?.filter(cat => cat.active).sort((a, b) => a.name.localeCompare(b.name)) || [];
  const maxMileOptions = [10, 15, 25, 50, 75, 100, 150];

  const containerClass = layout === 'horizontal' 
    ? "grid grid-cols-1 md:grid-cols-3 gap-4" 
    : "space-y-4";

  return (
    <div className={containerClass}>
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
          {layout === 'horizontal' ? 'Distance (Miles)' : 'Max Miles'}
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
    </div>
  );
};

export default FilterControls;
