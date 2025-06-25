
import React from 'react';
import { ClassifiedFilters } from '@/types/classifieds';
import ClassifiedCard from './ClassifiedCard';
import { useClassifieds } from '@/hooks/useClassifieds';

interface ClassifiedsListProps {
  filters: ClassifiedFilters;
}

const ClassifiedsList = ({ filters }: ClassifiedsListProps) => {
  const { data: classifieds, isLoading, error } = useClassifieds(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading classifieds: {error.message}</p>
      </div>
    );
  }

  if (!classifieds || classifieds.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No classifieds found</h3>
        <p className="text-gray-600">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classifieds.map((classified) => (
        <ClassifiedCard key={classified.id} classified={classified} />
      ))}
    </div>
  );
};

export default ClassifiedsList;
