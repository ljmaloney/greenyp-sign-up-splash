
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedFilters } from '@/types/classifieds';

interface ClassifiedsFiltersProps {
  filters: ClassifiedFilters;
  onFiltersChange: (filters: ClassifiedFilters) => void;
}

const ClassifiedsFilters = ({ filters, onFiltersChange }: ClassifiedsFiltersProps) => {
  const categories = [
    'Lawn & Garden Equipment',
    'Fruits, Vegetables',
    'Livestock',
    'Landscaping Services',
    'Garden Supplies',
    'Electronics',
    'Vehicles', 
    'Real Estate',
    'Jobs',
    'Services',
    'For Sale',
    'Wanted',
    'Community'
  ];

  const handleFilterChange = (key: keyof ClassifiedFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <Input
              type="text"
              placeholder="Enter zip code"
              value={filters.zipCode || ''}
              onChange={(e) => handleFilterChange('zipCode', e.target.value)}
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
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedsFilters;
