
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SubscribersHeader from '@/components/SubscribersHeader';
import Footer from '@/components/Footer';
import CategoryHeroSection from '@/components/category/CategoryHeroSection';
import CategoryCTASection from '@/components/category/CategoryCTASection';
import CategoryPageLoadingState from '@/components/category/CategoryPageLoadingState';
import CategoryPageErrorState from '@/components/category/CategoryPageErrorState';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryServices } from '@/hooks/useCategoryServices';
import { useProducerProfilesByLobUrl } from '@/hooks/useProducerProfiles';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';

const SubscriberCategoryPage = () => {
  const { urlLob } = useParams<{ urlLob: string }>();
  
  // Fetch all categories using the same service as the CategorySection
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Find the specific category based on the urlLob
  const category = categories?.find(cat => cat.urlLob === urlLob);
  
  // Fetch services for this category
  const { data: services, isLoading: servicesLoading, error: servicesError } = useCategoryServices(category?.lineOfBusinessId || '');
  
  // Fetch producer profiles for this category
  const { data: producerProfiles, isLoading: profilesLoading, error: profilesError } = useProducerProfilesByLobUrl(urlLob || '', true, 6);
  
  // Debug logging to understand what's happening with producer profiles
  useEffect(() => {
    console.log('🔍 Producer Profiles Debug:', {
      urlLob,
      profilesLoading,
      profilesError,
      producerProfiles,
      hasProfiles: producerProfiles?.response?.length,
      apiUrl: `/producer/profiles?lobUrl=${urlLob}&mostRecent=true&number=6`
    });
  }, [urlLob, profilesLoading, profilesError, producerProfiles]);
  
  useEffect(() => {
    // Update document title for SEO
    if (category) {
      document.title = `${category.lineOfBusinessName} - GreenYP Subscribers`;
      
      // Create meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      const metaDesc = `Learn about ${category.lineOfBusinessName.toLowerCase()} services and join GreenYP as a subscriber to list your business.`;
      
      if (metaDescription) {
        metaDescription.setAttribute('content', metaDesc);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = metaDesc;
        document.head.appendChild(meta);
      }
    }
  }, [category]);
  
  if (categoriesLoading) {
    return <CategoryPageLoadingState />;
  }
  
  if (categoriesError || !category) {
    return <CategoryPageErrorState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SubscribersHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <CategoryHeroSection 
          category={category}
          services={services}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
        />
        
        {/* Producer Profiles Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center">
                    Featured {category?.lineOfBusinessName} Professionals
                </h2>
            </div>
            
            {profilesLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-600">Loading profiles...</div>
              </div>
            )}
            
            {profilesError && (
              <div className="flex justify-center items-center py-8">
                <div className="text-red-600">Error loading profiles: {profilesError.message}</div>
              </div>
            )}
            
            {!profilesLoading && !profilesError && (!producerProfiles?.response || producerProfiles.response.length === 0) && (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-600">No profiles found for this category.</div>
              </div>
            )}
            
            {producerProfiles?.response && producerProfiles.response.length > 0 && (
              <>
                <div className="flex items-center justify-end mb-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const container = document.getElementById('producer-profiles-container');
                        if (container) {
                          container.scrollBy({ left: -300, behavior: 'smooth' });
                        }
                      }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById('producer-profiles-container');
                        if (container) {
                          container.scrollBy({ left: 300, behavior: 'smooth' });
                        }
                      }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              
              <div
                id="producer-profiles-container"
                className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {producerProfiles.response.map((profile) => (
                  <div
                    key={`${profile.producerId}-${profile.producerLocationId}`}
                    className="flex-shrink-0 bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow w-80"
                  >
                    <div className="flex items-center mb-4">
                      {profile.iconLink ? (
                        <img
                          src={profile.iconLink}
                          alt={`${profile.businessName} logo`}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                          onError={(e) => {
                            // Fallback to Lucide icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div
                        className={`${profile.iconLink ? 'hidden' : 'flex'} w-12 h-12 bg-greenyp-100 rounded-full items-center justify-center mr-4`}
                      >
                        <Building2 className="w-6 h-6 text-greenyp-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {profile.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {profile.city}, {profile.state}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {profile.phone && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Phone:</span> {profile.phone}
                        </p>
                      )}
                      {profile.websiteUrl && (
                        <a
                          href={profile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-greenyp-600 hover:text-greenyp-800 underline"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>
        </section>
        
        {/* CTA Section for Subscribers */}
        <section className="py-16 bg-greenyp-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Ready to List Your Green Business?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join us today and connect with customers looking for green market products and services in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/subscribers/signup"
                className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Sign Up Now
              </a>
              <a
                href="/subscribers/subscription-features"
                className="border border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View Features
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriberCategoryPage;
