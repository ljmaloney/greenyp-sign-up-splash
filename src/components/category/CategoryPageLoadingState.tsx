
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CategoryPageLoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPageLoadingState;
