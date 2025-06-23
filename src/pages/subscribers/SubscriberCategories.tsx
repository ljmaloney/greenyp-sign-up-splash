
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
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Industry Categories
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Loading categories...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 text-center transition-all border border-greenyp-100 animate-pulse h-48 max-w-xs mx-auto"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                </div>
              ))}
            </div>
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
        <main className="flex-grow bg-gray-50 py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Industry Categories
            </h1>
            <p className="text-xl text-red-600 mb-8">
              Error loading categories. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-8 h-8 text-greenyp-500 mx-auto mb-3" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Industry Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get listed in your industry category and connect with customers actively searching for your services
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {categories?.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 text-center transition-all hover:shadow-md border-2 border-greenyp-600 hover:border-yellow-500 h-48 max-w-xs mx-auto flex flex-col justify-between"
              >
                <div>
                  {renderIcon(category)}
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{category.lineOfBusinessName}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.shortDescription}</p>
                </div>
                <Link 
                  to={`/subscribers/categories/${category.lineOfBusinessId}`}
                  className="inline-flex items-center justify-center text-greenyp-600 hover:text-greenyp-800 font-medium text-sm"
                >
                  Show more information
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriberCategories;
