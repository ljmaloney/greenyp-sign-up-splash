
import React from 'react';
import { Link } from 'react-router-dom';
import SubscribersHeader from '@/components/SubscribersHeader';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { CategoryWithIcon } from '@/types/category';

const SubscriberCategories = () => {
  const { data: categories, isLoading, error } = useCategories();

  // Render the icon component
  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />;
  };

  const handleCategoryClick = (urlLob: string, categoryId: string) => {
    // Store the last visited category for back navigation
    sessionStorage.setItem('lastVisitedCategory', categoryId);
    sessionStorage.setItem('lastVisitedCategorySlug', urlLob);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SubscribersHeader />
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
        <SubscribersHeader />
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

  return (
    <div className="min-h-screen flex flex-col">
      <SubscribersHeader />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Find Local Green Industry Professionals by Category
          </h1>
          <p className="text-lg text-gray-700">
            Explore our growing network of skilled providers offering services in landscaping, lawn care, irrigation, tree work, hauling, cleanup, forestry mulching, and more.
            Filter by category to discover professionals near you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-100 border border-greenyp-100"
            >
              {renderIcon(category)}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.lineOfBusinessName}</h3>
              <p className="text-gray-600">{category.shortDescription}</p>
              <Link 
                to={`/subscribers/categories/${category.urlLob}`}
                onClick={() => handleCategoryClick(category.urlLob, category.lineOfBusinessId)}
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Show more information about ${category.lineOfBusinessName}`}
              >
                More Information
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
