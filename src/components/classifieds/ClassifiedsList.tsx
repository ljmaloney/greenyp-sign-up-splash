
import React from 'react';
import { ClassifiedFilters } from '@/types/classifieds';
import ClassifiedCard from './ClassifiedCard';
import { useClassifieds } from '@/hooks/useClassifieds';

interface ClassifiedsListProps {
  filters: ClassifiedFilters;
  categoryName?: string;
}

const ClassifiedsList = ({ filters, categoryName }: ClassifiedsListProps) => {
  const { data: classifieds, isLoading, error } = useClassifieds(filters);

  // Use consistent container with minimum height to prevent layout shifts
  const containerClasses = "min-h-[400px]";
  
  if (isLoading) {
    return (
      <div className={containerClasses}>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClasses} flex items-center justify-center`}>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading classifieds: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!classifieds || classifieds.length === 0) {
    const contextMessage = categoryName 
      ? `No ${categoryName.toLowerCase()} classifieds are currently available.`
      : 'No classifieds are currently available.';
    
    const encouragementMessage = categoryName
      ? `Be the first to post a ${categoryName.toLowerCase()} classified ad in this area!`
      : 'Check back soon or try adjusting your search filters.';

    return (
      <div className={`${containerClasses} flex items-center justify-center`}>
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {contextMessage}
          </h3>
          <p className="text-gray-600 mb-6">
            {encouragementMessage}
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/classifieds/post'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-greenyp-600 hover:bg-greenyp-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenyp-500 transition-colors"
            >
              Post a Classified Ad
            </button>
            <p className="text-xs text-gray-500">
              or browse other categories
            </p>
          </div>
        </div>
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
