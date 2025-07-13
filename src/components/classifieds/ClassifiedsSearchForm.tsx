
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedFilters } from '@/types/classifieds';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import CategoryDescriptionsDialog from './CategoryDescriptionsDialog';

interface ClassifiedsSearchFormProps {
  initialFilters?: ClassifiedFilters;
  onSearch?: (filters: ClassifiedFilters) => void;
  layout?: 'main' | 'search';
}

const ClassifiedsSearchForm = ({ 
  initialFilters = {}, 
  onSearch,
  layout = 'main' 
}: ClassifiedsSearchFormProps) => {
  const navigate = useNavigate();
  const { data: categoriesData } = useClassifiedCategories();
  
  const categories = categoriesData?.response?.filter(cat => cat.active).sort((a, b) => a.name.localeCompare(b.name)) || [];
  const maxMileOptions = [10, 15, 25, 50, 75, 100, 150];

  const [filters, setFilters] = React.useState<ClassifiedFilters>(initialFilters);

  const handleFilterChange = (key: keyof ClassifiedFilters, value: string) => {
    const newValue = value === 'all' ? undefined : value || undefined;
    setFilters(prev => ({
      ...prev,
      [key]: newValue
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      // Convert category name to categoryId for API call
      const apiFilters = { ...filters };
      if (filters.category) {
        const selectedCategory = categories.find(cat => cat.name === filters.category);
        if (selectedCategory) {
          apiFilters.category = selectedCategory.categoryId; // Use categoryId for API
        }
      }
      onSearch(apiFilters);
    } else {
      // Navigate to search page with filters
      const searchParams = new URLSearchParams();
      if (filters.category) searchParams.set('category', filters.category);
      if (filters.zipCode) searchParams.set('zipCode', filters.zipCode);
      if (filters.keyword) searchParams.set('keyword', filters.keyword);
      if (filters.maxMiles) searchParams.set('maxMiles', filters.maxMiles.toString());
      
      navigate(`/classifieds/search?${searchParams.toString()}`);
    }
  };

  if (layout === 'search') {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {/* First line: Zip Code, Max Miles, Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  Distance (Miles)
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <CategoryDescriptionsDialog />
                </div>
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
                value={filters.keyword || ''}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
              />
            </div>

            {/* Third line: Apply Filter and Clear Filters buttons */}
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
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Main layout (5-column)
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <CategoryDescriptionsDialog />
              </div>
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
                value={filters.keyword || ''}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                type="button"
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
              type="submit"
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Classifieds
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClassifiedsSearchForm;
