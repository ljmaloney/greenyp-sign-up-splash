
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassifiedFilters } from '@/types/classifieds';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

interface UseClassifiedSearchFormProps {
  initialFilters?: ClassifiedFilters;
  onSearch?: (filters: ClassifiedFilters) => void;
}

export const useClassifiedSearchForm = ({ 
  initialFilters = {}, 
  onSearch 
}: UseClassifiedSearchFormProps) => {
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

  return {
    filters,
    categories,
    maxMileOptions,
    handleFilterChange,
    clearFilters,
    handleSubmit
  };
};
