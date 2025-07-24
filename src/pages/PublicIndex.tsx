
import React from 'react';
import { CategoriesProvider } from '@/components/providers/CategoriesProvider';
import CategorySection from '@/components/CategorySection';

const PublicIndex = () => {
  return (
    <CategoriesProvider>
      <div className="min-h-screen">
        <main>
          <CategorySection />
        </main>
      </div>
    </CategoriesProvider>
  );
};

export default PublicIndex;
