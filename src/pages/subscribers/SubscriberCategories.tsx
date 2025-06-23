
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { CategoryWithIcon } from '@/types/category';

const SubscriberCategories = () => {
  const { data: categories, isLoading, error } = useCategories();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Industry Categories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[...Array(9)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-8 text-center transition-all border border-greenyp-100 animate-pulse w-full max-w-sm"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-6"></div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Industry Categories</h1>
          <p className="text-xl text-red-600 mb-4">Error loading categories. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Industry Categories
          </h1>
          <p className="text-xl text-gray-700">
            List your business in one of our supported categories and connect with customers today.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {categories?.map((category, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 text-center transition-all hover:shadow-md border-4 border-greenyp-600 hover:border-yellow-500 w-full max-w-sm sm:w-80 lg:w-72 flex flex-col"
            >
              <div className="flex-grow">
                {renderIcon(category)}
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.lineOfBusinessName}</h3>
                <p className="text-gray-600">{category.shortDescription}</p>
              </div>
              <Link 
                to={`/subscribers/categories/${category.lineOfBusinessId}`}
                className="mt-6 inline-flex items-center justify-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Show more information about ${category.lineOfBusinessName}`}
              >
                Show more information
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriberCategories;
