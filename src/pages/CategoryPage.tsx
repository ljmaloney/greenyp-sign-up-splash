
import React from 'react';
import { useParams } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Category: {categoryId}</h1>
          <p className="text-gray-600">Category content will be displayed here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
