
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import ClassifiedCard from '@/components/classifieds/ClassifiedCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClassifieds } from '@/hooks/useClassifieds';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  
  const filters = {
    category: searchParams.get('category') || undefined,
    zipCode: searchParams.get('zipCode') || undefined,
    keyword: searchParams.get('keyword') || undefined,
  };

  const { data: classifieds, isLoading, error } = useClassifieds(filters);

  const getSearchSummary = () => {
    const parts = [];
    if (filters.keyword) parts.push(`"${filters.keyword}"`);
    if (filters.category) parts.push(`in ${filters.category}`);
    if (filters.zipCode) parts.push(`near ${filters.zipCode}`);
    return parts.length > 0 ? parts.join(' ') : 'all classifieds';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/classifieds">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Classifieds
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
            <p className="text-gray-600">
              Showing results for {getSearchSummary()}
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading search results: {error.message}</p>
            </div>
          )}

          {!isLoading && !error && classifieds && classifieds.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classifieds.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} />
              ))}
            </div>
          )}

          {!isLoading && !error && (!classifieds || classifieds.length === 0) && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all classifieds.
              </p>
              <Link to="/classifieds">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                  Browse All Classifieds
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
