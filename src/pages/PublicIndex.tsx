
import React, { useEffect } from 'react';
import PublicHeader from '@/components/PublicHeader';
import SearchForm from '@/components/SearchForm';
import CategorySection from '@/components/CategorySection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import DevApiConfig from '@/components/DevApiConfig';
import { useCategoriesContext } from '@/components/providers/CategoriesProvider';
import { API_CONFIG, isUsingLocalApi } from '@/config/api';

const PublicIndex = () => {
  const { prefetchCategories, isCategoriesCached } = useCategoriesContext();

  // Log API configuration and prefetch categories on page load
  useEffect(() => {
    console.log('🌐 Current API Configuration:', {
      baseUrl: API_CONFIG.BASE_URL,
      imageBaseUrl: API_CONFIG.IMAGE_BASE_URL,
      isLocalApi: isUsingLocalApi()
    });

    // Prefetch categories if not already cached
    if (!isCategoriesCached()) {
      console.log('🚀 PublicIndex: Prefetching categories for better performance');
      prefetchCategories();
    } else {
      console.log('✅ PublicIndex: Categories already cached');
    }
  }, [prefetchCategories, isCategoriesCached]);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section without business dashboard */}
        <section className="relative hero-pattern py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Your Garden. Their Expertise.
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Search and connect with top-rated providers in landscaping, garden centers, lawn maintenance, and more.
              </p>
              
              <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-greenyp-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>From seeds to full-service landscaping—find green industry pros for every outdoor need.</span>
              </div>
            </div>
          </div>
        </section>
        
        <SearchForm />
        <CategorySection />
        <FeaturesSection />
      </main>
      
      <Footer />
      <DevApiConfig />
    </div>
  );
};

export default PublicIndex;
