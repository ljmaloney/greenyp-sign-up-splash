import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedCard from '@/components/classifieds/ClassifiedCard';
import ClassifiedsFiltersLive from '@/components/classifieds/ClassifiedsFiltersLive';
import SearchResultsLoadingState from '@/components/classifieds/SearchResultsLoadingState';
import { useCategoryClassifieds } from '@/hooks/useCategoryClassifieds';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import { ClassifiedFilters } from '@/types/classifieds';
import { Button } from '@/components/ui/button';
import { Search, Lightbulb } from 'lucide-react';

const ClassifiedCategoryPage = () => {
  const { urlName } = useParams<{ urlName: string }>();
  const navigate = useNavigate();
  const { data: classifiedsData, isLoading: isLoadingClassifieds, error: classifiedsError } = useCategoryClassifieds(urlName || '');
  const { data: categoriesData } = useClassifiedCategories();

  // Handle search form submission
  const handleSearch = (filters: ClassifiedFilters) => {
    console.log('Searching with filters:', filters);
    // Navigate to search results with filters
    const searchParams = new URLSearchParams();
    if (filters.keyword) searchParams.set('keyword', filters.keyword);
    if (filters.category) searchParams.set('category', filters.category);
    if (filters.zipCode) searchParams.set('zipCode', filters.zipCode);
    if (filters.maxMiles) searchParams.set('maxMiles', filters.maxMiles.toString());
    navigate(`/classifieds/search?${searchParams.toString()}`);
  };



  // Find the current category to display its name
  const currentCategory = categoriesData?.response?.find(cat => cat.urlName === urlName);
  const classifieds = classifiedsData || [];

  if (isLoadingClassifieds) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCategory?.name || 'Category'}
              </h1>
              <p className="text-gray-600">
                {currentCategory?.shortDescription || `Loading classifieds...`}
              </p>
            </div>
            
            <SearchResultsLoadingState />
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  if (classifiedsError) {
    
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header with friendly error message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCategory?.name || 'Category'}
              </h1>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">
                      We're having trouble loading recent ads in this category
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      But don't worry! You can still search for what you need or check out our example below.
                    </p>
                  </div>
                </div>
              </div>
            </div>






          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentCategory?.name || 'Category'}
              <span className="text-gray-600 text-base font-normal ml-2">
                --- {currentCategory?.shortDescription || `Browse classifieds in the ${urlName} category`}
              </span>
            </h1>
              <span className="text-gray-600"></span>
          </div>

          {classifieds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                No classifieds found in {currentCategory?.name || 'this category'} yet.
              </div>
              <p className="text-sm text-gray-400">
                Be the first to post an ad in this category!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classifieds.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} />
              ))}
            </div>
          )}
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default ClassifiedCategoryPage;
