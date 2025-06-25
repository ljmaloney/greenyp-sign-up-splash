
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedFilters } from '@/types/classifieds';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ClassifiedsFiltersProps {
  filters: ClassifiedFilters;
  onFiltersChange: (filters: ClassifiedFilters) => void;
}

const ClassifiedsFilters = ({ filters, onFiltersChange }: ClassifiedsFiltersProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/classifieds/search';
  
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

  const maxMileOptions = [10, 15, 25, 50, 75, 100, 150];

  const handleFilterChange = (key: keyof ClassifiedFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const handleSearch = () => {
    if (!isSearchPage) {
      const searchParams = new URLSearchParams();
      if (filters.category) searchParams.set('category', filters.category);
      if (filters.zipCode) searchParams.set('zipCode', filters.zipCode);
      if (filters.keyword) searchParams.set('keyword', filters.keyword);
      if (filters.maxMiles) searchParams.set('maxMiles', filters.maxMiles.toString());
      
      navigate(`/classifieds/search?${searchParams.toString()}`);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
              Max Miles
            </label>
            <Select 
              value={filters.maxMiles?.toString() || 'all'} 
              onValueChange={(value) => handleFilterChange('maxMiles', value)}
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

        {!isSearchPage && (
          <div className="flex justify-center">
            <Button 
              onClick={handleSearch}
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Classifieds
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassifiedsFilters;
