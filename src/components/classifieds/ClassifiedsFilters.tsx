
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedFilters } from '@/types/classifieds';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import CategoryDescriptionsDialog from './CategoryDescriptionsDialog';

interface ClassifiedsFiltersProps {
  filters: ClassifiedFilters;
  onFiltersChange: (filters: ClassifiedFilters) => void;
}

const ClassifiedsFilters = ({ filters, onFiltersChange }: ClassifiedsFiltersProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/classifieds/search';
  const { data: categoriesData } = useClassifiedCategories();
  
  const categories = categoriesData?.response?.filter(cat => cat.active).sort((a, b) => a.name.localeCompare(b.name)) || [];
  const maxMileOptions = [10, 15, 25, 50, 75, 100, 150];

  // Local state to prevent immediate updates while typing
  const [localFilters, setLocalFilters] = useState<ClassifiedFilters>(filters);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local filters when props change (for external updates)
  useEffect(() => {
    setLocalFilters(filters);
    setHasChanges(false);
  }, [filters]);

  // Debounced update for keyword changes
  useEffect(() => {
    if (!hasChanges) return;

    const timeoutId = setTimeout(() => {
      if (isSearchPage) {
        // On search page, don't auto-apply - wait for user to click Apply
        return;
      }
      // On main classifieds page, apply changes with debounce
      onFiltersChange(localFilters);
      setHasChanges(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, hasChanges, isSearchPage, onFiltersChange]);

  const handleLocalFilterChange = useCallback((key: keyof ClassifiedFilters, value: string) => {
    const newValue = value === 'all' ? undefined : value || undefined;
    
    setLocalFilters(prev => ({
      ...prev,
      [key]: newValue
    }));

    // For non-keyword changes, apply immediately if not on search page
    if (key !== 'keyword') {
      const newFilters = {
        ...localFilters,
        [key]: newValue
      };
      
      if (!isSearchPage) {
        onFiltersChange(newFilters);
      } else {
        setHasChanges(true);
      }
    } else {
      setHasChanges(true);
    }
  }, [localFilters, isSearchPage, onFiltersChange]);

  const clearFilters = () => {
    setLocalFilters({});
    setHasChanges(false);
    onFiltersChange({});
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setHasChanges(false);
  };

  const handleSearch = () => {
    if (!isSearchPage) {
      const searchParams = new URLSearchParams();
      if (localFilters.category) searchParams.set('category', localFilters.category);
      if (localFilters.zipCode) searchParams.set('zipCode', localFilters.zipCode);
      if (localFilters.keyword) searchParams.set('keyword', localFilters.keyword);
      if (localFilters.maxMiles) searchParams.set('maxMiles', localFilters.maxMiles.toString());
      
      navigate(`/classifieds/search?${searchParams.toString()}`);
    }
  };

  if (isSearchPage) {
    // Layout for search results page - 3 lines
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* First line: Zip Code, Max Miles, Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <Input
                type="text"
                placeholder="Enter zip code"
                value={localFilters.zipCode || ''}
                onChange={(e) => handleLocalFilterChange('zipCode', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (Miles)
              </label>
              <Select 
                value={localFilters.maxMiles?.toString() || 'all'} 
                onValueChange={(value) => handleLocalFilterChange('maxMiles', value)}
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
                value={localFilters.category || 'all'}
                onValueChange={(value) => handleLocalFilterChange('category', value)}
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

          {/* Second line: Search Keywords */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Keywords
            </label>
            <Input
              type="text"
              placeholder="Search by title"
              value={localFilters.keyword || ''}
              onChange={(e) => handleLocalFilterChange('keyword', e.target.value)}
            />
          </div>

          {/* Third line: Apply Filter and Clear Filters buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={applyFilters}
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8"
              disabled={!hasChanges}
            >
              <Search className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
            <Button 
              variant="outline" 
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Layout for main classifieds page - original 5-column layout
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <Input
              type="text"
              placeholder="Enter zip code"
              value={localFilters.zipCode || ''}
              onChange={(e) => handleLocalFilterChange('zipCode', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Miles
            </label>
            <Select 
              value={localFilters.maxMiles?.toString() || 'all'} 
              onValueChange={(value) => handleLocalFilterChange('maxMiles', value)}
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
              value={localFilters.category || 'all'}
              onValueChange={(value) => handleLocalFilterChange('category', value)}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Keywords
            </label>
            <Input
              type="text"
              placeholder="Search by title"
              value={localFilters.keyword || ''}
              onChange={(e) => handleLocalFilterChange('keyword', e.target.value)}
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

        <div className="flex justify-center">
          <Button 
            onClick={handleSearch}
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

export default ClassifiedsFilters;
