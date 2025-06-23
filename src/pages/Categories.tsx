
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { useCategories } from '@/hooks/useCategories';
import { CategoryWithIcon } from '@/types/category';
import { ChevronRight } from 'lucide-react';

const Categories = () => {
  const { data: categories, isLoading, error } = useCategories();

  // Render the icon component
  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">All Categories</h1>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-8">All Categories</h1>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            All Categories
          </h1>
          <p className="text-xl text-gray-700">
            Browse all available green industry categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {categories?.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-100 border border-greenyp-100 w-full max-w-sm"
            >
              {renderIcon(category)}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.lineOfBusinessName}</h3>
              <p className="text-gray-600">{category.shortDescription}</p>
              <Link 
                to={`/categories/${category.lineOfBusinessId}`}
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Show more information about ${category.lineOfBusinessName}`}
              >
                View Providers
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

export default Categories;
