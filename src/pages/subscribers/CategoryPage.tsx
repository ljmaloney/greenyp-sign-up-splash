import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecentListings from '@/components/RecentListings';
import CategoryHeroSection from '@/components/category/CategoryHeroSection';
import CategoryServicesSection from '@/components/category/CategoryServicesSection';
import CategoryCTASection from '@/components/category/CategoryCTASection';
import CategoryPageLoadingState from '@/components/category/CategoryPageLoadingState';
import CategoryPageErrorState from '@/components/category/CategoryPageErrorState';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryServices } from '@/hooks/useCategoryServices';

const CategoryPage = () => {
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
      document.title = `${category.lineOfBusinessName} - GreenYP`;
      
      // Create meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      const metaDesc = `Connect with top-rated ${category.lineOfBusinessName.toLowerCase()} professionals. Browse reviews, see portfolios, and request quotes.`;
      
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

        {/* Recent Listings Section - This will show empty state if API fails */}
        <RecentListings 
          lineOfBusinessId={lineOfBusinessId || ''} 
          categoryName={category.lineOfBusinessName} 
        />
        
        {/* CTA Section */}
        <CategoryCTASection categoryName={category.lineOfBusinessName} />
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
