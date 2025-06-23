
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

const SearchLoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenyp-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Searching for providers...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchLoadingState;
