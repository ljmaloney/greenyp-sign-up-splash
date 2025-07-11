
import React, { useState, useEffect, useCallback } from 'react';
import { ClassifiedFilters } from '@/types/classifieds';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchPageFilters from './SearchPageFilters';
import MainPageFilters from './MainPageFilters';

interface ClassifiedsFiltersProps {
  filters: ClassifiedFilters;
  onFiltersChange: (filters: ClassifiedFilters) => void;
}

const ClassifiedsFilters = ({ filters, onFiltersChange }: ClassifiedsFiltersProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === '/classifieds/search';

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
    return (
      <SearchPageFilters
        filters={localFilters}
        onFilterChange={handleLocalFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        hasChanges={hasChanges}
      />
    );
  }

  return (
    <MainPageFilters
      filters={localFilters}
      onFilterChange={handleLocalFilterChange}
      onSearch={handleSearch}
      onClearFilters={clearFilters}
    />
  );
};

export default ClassifiedsFilters;
