
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHeroSection from '@/components/category/CategoryHeroSection';
import CategoryCTASection from '@/components/category/CategoryCTASection';
import CategoryPageLoadingState from '@/components/category/CategoryPageLoadingState';
import CategoryPageErrorState from '@/components/category/CategoryPageErrorState';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryServices } from '@/hooks/useCategoryServices';

const SubscriberCategoryPage = () => {
  const { lineOfBusinessId } = useParams<{ lineOfBusinessId: string }>();
  
  // Fetch all categories using the same service as the CategorySection
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Find the specific category based on the lineOfBusinessId
  const category = categories?.find(cat => cat.lineOfBusinessId === lineOfBusinessId);
  
  // Fetch services for this category
  const { data: services, isLoading: servicesLoading, error: servicesError } = useCategoryServices(lineOfBusinessId || '');
  
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
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <CategoryHeroSection 
          category={category}
          services={services}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
        />
        
        {/* CTA Section for Subscribers */}
        <section className="py-16 bg-greenyp-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Ready to List Your {category.lineOfBusinessName} Business?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join GreenYP today and connect with customers looking for {category.lineOfBusinessName.toLowerCase()} services in your area.
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
