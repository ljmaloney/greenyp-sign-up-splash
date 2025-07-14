
import React from 'react';
import { ClassifiedFilters } from '@/types/classifieds';
import { useClassifiedSearchForm } from '@/hooks/useClassifiedSearchForm';
import SearchFormMainLayout from './SearchFormMainLayout';
import SearchFormSearchLayout from './SearchFormSearchLayout';

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
  const {
    filters,
    categories,
    maxMileOptions,
    handleFilterChange,
    clearFilters,
    handleSubmit
  } = useClassifiedSearchForm({ initialFilters, onSearch });

  if (layout === 'search') {
    return (
      <SearchFormSearchLayout
        filters={filters}
        categories={categories}
        maxMileOptions={maxMileOptions}
        onFilterChange={handleFilterChange}
        onSubmit={handleSubmit}
        onClearFilters={clearFilters}
      />
    );
  }

  return (
    <SearchFormMainLayout
      filters={filters}
      categories={categories}
      maxMileOptions={maxMileOptions}
      onFilterChange={handleFilterChange}
      onSubmit={handleSubmit}
      onClearFilters={clearFilters}
    />
  );
};

export default ClassifiedsSearchForm;
