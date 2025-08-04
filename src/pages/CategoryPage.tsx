
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import RecentListings from '@/components/RecentListings';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryServices } from '@/hooks/useCategoryServices';
import { CategoryWithIcon } from '@/types/category';

const CategoryPage = () => {
  const { urlLob } = useParams<{ urlLob: string }>();
  
  // Fetch all categories using the same service as the CategorySection
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Find the specific category based on the urlLob slug
  const category = categories?.find(cat => cat.urlLob === urlLob);
  
  // Fetch services for this category using lineOfBusinessId
  const { data: services, isLoading: servicesLoading, error: servicesError } = useCategoryServices(category?.lineOfBusinessId || '');
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
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

  const handleListBusinessClick = () => {
    console.log('List Your Business button clicked - navigating to /subscribers/signup');
  };

  const handleLearnMoreClick = () => {
    console.log('Learn More button clicked - navigating to /subscribers');
  };
  
  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (categoriesError || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="mb-8">We couldn't find the category you're looking for.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Render the icon component
  const renderIcon = (category: CategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    return <IconComponent className="w-12 h-12 text-greenyp-500" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-greenyp-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              {renderIcon(category)}
              <h1 className="text-3xl md:text-4xl font-bold ml-2 text-gray-900 text-left">{category.lineOfBusinessName}</h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl text-left">{category.shortDescription}</p>
            
            {category.description && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-greenyp-200">
                <p className="text-gray-700 mb-3 text-left">{category.description}</p>
                
                {/* Services with green checkmarks */}
                {services && services.length > 0 && !servicesLoading && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-left">Available Services:</h3>
                    <ul className="space-y-1 text-gray-700">
                      {services.map((service) => (
                        <li key={service.lobServiceId} className="text-sm flex items-start text-left">
                          <Check className="w-4 h-4 text-greenyp-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            <span className="font-medium">{service.serviceName}</span> - {service.serviceDescription}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {servicesLoading && (
                  <div className="text-sm text-gray-600 text-left">Loading services...</div>
                )}
                
                {servicesError && (
                  <div className="text-sm text-red-600 text-left">Error loading services. Please try again later.</div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Search Form Section with category preselected */}
        <SearchForm showHeading={false} />
        
        {/* Recent Listings Section - This calls the real API */}
        <RecentListings 
          lineOfBusinessId={category.lineOfBusinessId || ''} 
          categoryName={category.lineOfBusinessName} 
        />
        
        {/* CTA Section */}
        <section className="bg-greenyp-100 py-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Are you a {category.lineOfBusinessName} professional?
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              List your business in our directory and connect with customers looking for your services
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
                <Link to="/subscribers/signup" onClick={handleListBusinessClick}>
                  List Your Business
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-greenyp-600 text-greenyp-700">
                <Link to="/subscribers" onClick={handleLearnMoreClick}>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
