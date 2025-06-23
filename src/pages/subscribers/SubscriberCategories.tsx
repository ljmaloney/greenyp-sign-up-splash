
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
                  className="bg-white rounded-xl p-8 text-center transition-all border border-greenyp-100 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
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
    return <IconComponent className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />;
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
          
          <div className="flex flex-wrap justify-center gap-8">
            {categories?.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 text-center transition-all hover:shadow-md border-4 border-greenyp-600 hover:border-yellow-500 w-full max-w-sm sm:w-80 lg:w-72 flex flex-col"
              >
                <div className="flex-grow">
                  {renderIcon(category)}
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.lineOfBusinessName}</h3>
                  <p className="text-gray-600 mb-6">{category.shortDescription}</p>
                </div>
                <Link 
                  to={`/subscribers/categories/${category.lineOfBusinessId}`}
                  className="mt-6 inline-flex items-center justify-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                >
                  Show more information
                  <ChevronRight className="w-4 h-4 ml-2" />
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
