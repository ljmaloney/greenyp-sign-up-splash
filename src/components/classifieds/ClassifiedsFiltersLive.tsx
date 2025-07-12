
import React, { useState, useEffect, useCallback } from 'react';
import { ClassifiedFilters } from '@/types/classifieds';
import ClassifiedsSearchForm from './ClassifiedsSearchForm';

interface ClassifiedsFiltersLiveProps {
  filters: ClassifiedFilters;
  onFiltersChange: (filters: ClassifiedFilters) => void;
}

const ClassifiedsFiltersLive = ({ filters, onFiltersChange }: ClassifiedsFiltersLiveProps) => {
  const [localFilters, setLocalFilters] = useState<ClassifiedFilters>(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced update for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFiltersChange]);

  const handleFiltersChange = useCallback((newFilters: ClassifiedFilters) => {
    setLocalFilters(newFilters);
  }, []);

  return (
    <ClassifiedsSearchForm
      initialFilters={localFilters}
      onSearch={handleFiltersChange}
      layout="main"
    />
  );
};

export default ClassifiedsFiltersLive;
