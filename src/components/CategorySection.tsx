
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { CategoryWithIcon } from '@/types/category';

const CategorySection = () => {
  const { data: categories, isLoading, error } = useCategories();
  const navigate = useNavigate();
  
  const handleCategoryClick = (category: CategoryWithIcon) => {
    navigate(`/categories/${category.slug}`);
  };

  if (isLoading) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Supported Industry Categories
            </h2>
            <p className="text-xl text-gray-700">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-8 text-center transition-all border border-greenyp-100 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Supported Industry Categories
            </h2>
            <p className="text-xl text-red-600">
              Error loading categories. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Render the IconComponent for each category
  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500 mx-auto mb-4" />;
  };

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Supported Industry Categories
          </h2>
          <p className="text-xl text-gray-700">
            Find qualified green industry professionals in your area by category
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories?.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 text-center transition-all hover:shadow-md hover:bg-gray-100 border border-greenyp-100 cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              {renderIcon(category)}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
              <button 
                className="mt-6 inline-flex items-center text-greenyp-600 hover:text-greenyp-800 font-medium"
                aria-label={`Find ${category.title} Providers`}
              >
                Find Providers
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
