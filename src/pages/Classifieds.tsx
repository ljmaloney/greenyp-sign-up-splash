
import React, { useState } from 'react';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import { ClassifiedFilters } from '@/types/classifieds';

const Classifieds = () => {
  const [filters] = useState<ClassifiedFilters>({});

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Classifieds</h1>
          </div>
          
          <ClassifiedsList filters={filters} />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Classifieds;
