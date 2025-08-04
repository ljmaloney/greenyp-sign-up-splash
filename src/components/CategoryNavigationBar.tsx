import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { Button } from '@/components/ui/button';

const CategoryNavigationBar = () => {
  const { data: categories, isLoading, error } = useLineOfBusiness();

  if (isLoading || error || !categories?.length) {
    return null; // Don't render if loading, error, or no data
  }

  const scrollLeft = () => {
    const container = document.getElementById('category-nav-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('category-nav-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200 w-full overflow-hidden">
      <div className="flex items-center w-full">
        {/* Static Home button - Left - Always visible */}
        <div className="flex-shrink-0 bg-gray-100 px-4 py-1 border-r border-gray-200">
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 py-1 px-3 rounded hover:bg-white/50 whitespace-nowrap"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </div>
          <div className="flex-shrink-0 bg-gray-100 px-4 py-1 border-r border-gray-200">
              <Link
                  to="/classifieds"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 py-1 px-3 rounded hover:bg-white/50 whitespace-nowrap"
              >
                  Classifieds
              </Link>
          </div>
        {/* Scrollable categories section - Center - Takes remaining space */}
        <div className="flex-1 min-w-0 relative">
          {/* Left scroll button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-gray-100 via-gray-100 to-transparent w-8 hover:from-gray-200 hover:via-gray-200 transition-colors duration-200 hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Scrollable categories container */}
          <div
            id="category-nav-container"
            className="flex overflow-x-auto py-1 px-4 md:px-12 space-x-6 scroll-smooth"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
              WebkitOverflowScrolling: 'touch' // iOS smooth scrolling
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.lineOfBusinessId}
                to={`/categories/${category.urlLob}`}
                className="flex-shrink-0 text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 whitespace-nowrap py-1 px-2 rounded hover:bg-white/50"
              >
                {category.lineOfBusinessName}
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 z-20 bg-gradient-to-l from-gray-100 via-gray-100 to-transparent w-8 hover:from-gray-200 hover:via-gray-200 transition-colors duration-200 hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Static buttons - Right - Always visible */}
        <div className="flex-shrink-0 bg-gray-100 flex items-center space-x-1 px-3 py-1 border-l border-gray-200">
          <Link to="/subscribers">
            <Button 
              variant="outline" 
              size="sm"
              className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 text-xs whitespace-nowrap h-7 px-2"
            >
              Be a Green Pro
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button 
              size="sm"
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white text-xs whitespace-nowrap h-7 px-2"
            >
              Pro Login
            </Button>
          </Link>
        </div>
      </div>
      
      <style>{`
        #category-nav-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryNavigationBar;
