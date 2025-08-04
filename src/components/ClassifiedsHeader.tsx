
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClassifiedsNavigation } from "@/hooks/useClassifiedsNavigation";
import { useClassifiedCategories } from "@/hooks/useClassifiedCategories";
import {Leaf, ArrowLeft, Eye, Plus, ChevronLeft, ChevronRight} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ClassifiedsHeader = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { getBackNavigation, shouldShowBackButton } = useClassifiedsNavigation();
  const { data: categoriesData, isLoading, error } = useClassifiedCategories();
  
  const handleBackClick = () => {
    const backNav = getBackNavigation();
    if (backNav) {
      navigate(backNav.backUrl);
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('categories-nav-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('categories-nav-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const backNavigation = getBackNavigation();
  const categories = categoriesData?.response?.filter(cat => cat.active) || [];
  
  return (
    <>
      {/* Main Header */}
      <header className="py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b">
        <div className="flex flex-col">
          <Link to="/classifieds" className="text-2xl font-bold text-greenyp-700 flex items-center">
            <Leaf className="mr-2 h-8 w-8" />
            <span>GreenYP - Classifieds</span>
          </Link>
          <p className="text-xs text-gray-600 mt-1">
            Buy and sell lawn, garden, and agricultural equipment and services.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {shouldShowBackButton() && backNavigation && (
            <Button 
              variant="outline" 
              className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
              onClick={handleBackClick}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backNavigation.backLabel}
            </Button>
          )}
        </div>
      </header>

      {/* Menu Bar */}
      <div className="bg-gray-100 border-b border-gray-200 w-full overflow-hidden">
        <div className="flex items-center w-full">
          {/* Left pinned - Back to Market button */}
          <div className="flex-shrink-0 bg-gray-100 px-4 py-1 border-r border-gray-200">
            <Link to="/">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 text-xs h-7 px-2">
                Back to the Market
              </Button>
            </Link>
          </div>

          {/* Center - Scrollable categories */}
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
              id="categories-nav-container"
              className="flex overflow-x-auto py-1 px-4 md:px-12 space-x-6 scroll-smooth"
              style={{
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE and Edge
                WebkitOverflowScrolling: 'touch' // iOS smooth scrolling
              }}
            >
              {!isLoading && !error && categories.map((category) => (
                <Link
                  key={category.categoryId}
                  to={`/classifieds/${category.urlName}`}
                  className="flex-shrink-0 text-sm font-medium text-gray-700 hover:text-greenyp-600 transition-colors duration-200 whitespace-nowrap py-1 px-2 rounded hover:bg-white/50"
                >
                  {category.name}
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

          {/* Right pinned - View Ad Types and Post an Ad buttons */}
          <div className="flex-shrink-0 bg-gray-100 flex items-center space-x-1 px-3 py-1 border-l border-gray-200">
            <Link to="/classifieds/samples">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 text-xs whitespace-nowrap h-7 px-2">
                <Eye className="w-3 h-3 mr-1" />
                View Ad Types
              </Button>
            </Link>
            <Link to="/classifieds/create">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white text-xs whitespace-nowrap h-7 px-2">
                <Plus className="w-3 h-3 mr-1" />
                Post an Ad
              </Button>
            </Link>
          </div>
        </div>
        
        <style>{`
          #categories-nav-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default ClassifiedsHeader;
