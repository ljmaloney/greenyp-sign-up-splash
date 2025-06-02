
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
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
              Find qualified green industry professionals in your area by category
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-50 border border-greenyp-100"
              >
                {renderIcon(category)}
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.lineOfBusinessName}</h3>
                <p className="text-gray-600 mb-6">{category.shortDescription}</p>
                <Link to={`/subscriber/categories/${category.lineOfBusinessId}`}>
                  <Button 
                    className="bg-greenyp-600 hover:bg-greenyp-700 text-white inline-flex items-center"
                  >
                    Show more information
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
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
