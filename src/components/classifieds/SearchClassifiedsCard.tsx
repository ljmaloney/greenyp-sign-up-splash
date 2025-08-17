import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RotateCcw } from 'lucide-react';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import { ClassifiedFilters } from '@/types/classifieds';

interface SearchClassifiedsCardProps {
  onSearch: (filters: ClassifiedFilters) => void;
  initialFilters?: ClassifiedFilters;
}

const SearchClassifiedsCard = ({ onSearch, initialFilters = {} }: SearchClassifiedsCardProps) => {
  const [zipCode, setZipCode] = useState(initialFilters.zipCode || '');
  const [maxMiles, setMaxMiles] = useState(initialFilters.maxMiles?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.selectedCategory || '');
  const [keywords, setKeywords] = useState(initialFilters.keyword || '');

  const { data: categoriesData, isLoading: categoriesLoading } = useClassifiedCategories();
  const categories = categoriesData?.response?.filter(cat => cat.active).sort((a, b) => a.name.localeCompare(b.name)) || [];

  // Debug categories and selection
  useEffect(() => {
    if (categories.length > 0) {
      console.log('📋 Available categories:', categories);
      console.log('🎯 Current selectedCategory:', selectedCategory);
      const matchingCategory = categories.find(cat => cat.categoryId === selectedCategory);
      console.log('✅ Found matching category:', matchingCategory);
    }
  }, [categories, selectedCategory]);

  // Sync local state with initialFilters when they change (e.g., navigating to a category page)
  useEffect(() => {
    console.log('🔄 SearchClassifiedsCard - initialFilters changed:', initialFilters);
    console.log('🔄 Setting selectedCategory to:', initialFilters.selectedCategory);
    setZipCode(initialFilters.zipCode || '');
    setMaxMiles(initialFilters.maxMiles?.toString() || '');
    setSelectedCategory(initialFilters.selectedCategory || '');
    setKeywords(initialFilters.keyword || '');
  }, [
    initialFilters.zipCode, 
    initialFilters.maxMiles, 
    initialFilters.selectedCategory, 
    initialFilters.keyword
  ]);

  const maxMilesOptions = [
    { value: '10', label: '10 miles' },
    { value: '25', label: '25 miles' },
    { value: '50', label: '50 miles' },
    { value: '75', label: '75 miles' },
    { value: '100', label: '100 miles' },
    { value: '150', label: '150 miles' }
  ];

  const handleSearch = () => {
    const filters: ClassifiedFilters = {
      ...(zipCode && { zipCode }),
      ...(maxMiles && { maxMiles: parseInt(maxMiles) }),
      ...(selectedCategory && { selectedCategory }),
      ...(keywords && { keyword: keywords })
    };
    
    onSearch(filters);
  };

  const handleReset = () => {
    setZipCode('');
    setMaxMiles('');
    setSelectedCategory('');
    setKeywords('');
    
    // Call onSearch with empty filters to reset the results
    onSearch({});
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase for Canadian postal codes
    // Allow any input while typing, validation will happen on search
    setZipCode(value);
  };

  const isSearchDisabled = !zipCode && !maxMiles && !selectedCategory && !keywords;

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-greenyp-700">
          Search Classifieds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Zip Code */}
          <div className="space-y-2">
            <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <Input
              id="zipCode"
              type="text"
              placeholder="12345 or A1A 1A1"
              value={zipCode}
              onChange={handleZipCodeChange}
              className="focus:ring-greenyp-500 focus:border-greenyp-500"
              maxLength={10}
            />
            <p className="text-xs text-gray-500">
              US Zip Code or Canadian Postal Code
            </p>
          </div>

          {/* Max Miles */}
          <div className="space-y-2">
            <label htmlFor="maxMiles" className="text-sm font-medium text-gray-700">
              Max Distance
            </label>
            <Select value={maxMiles} onValueChange={setMaxMiles}>
              <SelectTrigger className="focus:ring-greenyp-500 focus:border-greenyp-500">
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                {maxMilesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={categoriesLoading}>
              <SelectTrigger className="focus:ring-greenyp-500 focus:border-greenyp-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
              Keywords
            </label>
            <Input
              id="keywords"
              type="text"
              placeholder="Search terms..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="focus:ring-greenyp-500 focus:border-greenyp-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="bg-greenyp-600 hover:bg-greenyp-700 text-white flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Classifieds
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchClassifiedsCard;
