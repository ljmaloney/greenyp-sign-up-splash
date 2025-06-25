
import React from 'react';
import { useRecentClassifieds } from '@/hooks/useRecentClassifieds';
import ClassifiedCard from './ClassifiedCard';

const RecentClassifieds = () => {
  const { data: recentClassifieds, isLoading, error } = useRecentClassifieds();

  if (isLoading || error || !recentClassifieds || recentClassifieds.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Classifieds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentClassifieds.slice(0, 6).map((classified) => (
          <ClassifiedCard key={classified.id} classified={classified} />
        ))}
      </div>
    </div>
  );
};

export default RecentClassifieds;
