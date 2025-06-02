
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryServices } from '@/hooks/useCategoryServices';
import { CategoryWithIcon } from '@/types/category';

interface Provider {
  name: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  producerId: string;
}

// Mock provider data - in a real app, this would come from an API
const mockProviders: Provider[] = [
  { name: "Green Thumb Landscaping", rating: 4.8, reviews: 124, location: "Phoenix, AZ", phone: "(602) 555-1234", producerId: "producer-001" },
  { name: "Nature's Design", rating: 4.7, reviews: 98, location: "Scottsdale, AZ", phone: "(480) 555-5678", producerId: "producer-002" },
  { name: "Outdoor Creations", rating: 4.9, reviews: 156, location: "Mesa, AZ", phone: "(480) 555-9012", producerId: "producer-003" },
  { name: "Pacific Garden Services", rating: 4.6, reviews: 87, location: "Tempe, AZ", phone: "(480) 555-3456", producerId: "producer-004" },
  { name: "Professional Yard Solutions", rating: 4.5, reviews: 65, location: "Gilbert, AZ", phone: "(480) 555-7890", producerId: "producer-005" },
  { name: "Desert Oasis Landscapes", rating: 4.8, reviews: 112, location: "Chandler, AZ", phone: "(480) 555-4321", producerId: "producer-006" }
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch all categories using the same service as the CategorySection
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Find the specific category based on the lineOfBusinessId (slug)
  const category = categories?.find(cat => cat.lineOfBusinessId === slug);
  
  // Fetch services for this category
  const { data: services, isLoading: servicesLoading, error: servicesError } = useCategoryServices(slug || '');
  
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
          <Link to="/subscriber">
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
        <section className="bg-greenyp-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              {renderIcon(category)}
              <h1 className="text-3xl md:text-4xl font-bold ml-2 text-gray-900">{category.lineOfBusinessName}</h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">{category.shortDescription}</p>
            
            {category.description && (
              <div className="mt-6 p-6 bg-white rounded-lg border border-greenyp-200">
                <p className="text-gray-700">{category.description}</p>
              </div>
            )}
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
                Find by Location
              </Button>
              <Button variant="outline" className="border-greenyp-500 text-greenyp-700">
                Filter Results
              </Button>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        {services && services.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Services</h2>
              {servicesLoading ? (
                <div className="text-center">Loading services...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-lg mb-2">{service.serviceName}</h3>
                      <p className="text-gray-600 text-sm">{service.serviceDescription}</p>
                    </div>
                  ))}
                </div>
              )}
              {servicesError && (
                <div className="text-center text-red-600">Error loading services. Please try again later.</div>
              )}
            </div>
          </section>
        )}
        
        {/* Provider Listings */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent {category.lineOfBusinessName} Listings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProviders.map((provider, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-xl mb-2">{provider.name}</h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="ml-1 font-medium">{provider.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm ml-2">({provider.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <span className="text-gray-600">{provider.location}</span>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <Phone className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <span className="text-gray-600">{provider.phone}</span>
                  </div>
                  
                  <Link to={`/profile/${provider.producerId}`}>
                    <Button className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white mt-2">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-greenyp-100 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Are you a {category.lineOfBusinessName} professional?
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              List your business in our directory and connect with customers looking for your services
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
                List Your Business
              </Button>
              <Button variant="outline" className="border-greenyp-600 text-greenyp-700">
                Learn More
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
