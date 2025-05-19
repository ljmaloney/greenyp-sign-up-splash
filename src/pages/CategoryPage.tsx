
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { TreeDeciduous, Shrub, LeafyGreen, Tractor, Shovel, Droplets, MapPin, Phone, Star } from 'lucide-react';

// Define the categories with icons and metadata for SEO
const categoryData = {
  "landscaping": {
    title: "Landscaping Services",
    icon: <Tractor className="w-6 h-6 text-greenyp-500" />,
    description: "Find professional landscape design and installation services in your area",
    metaDescription: "Connect with top-rated landscaping professionals. Browse reviews, see portfolios, and request quotes from the best landscapers in your area.",
    providers: [
      { name: "Green Thumb Landscaping", rating: 4.8, reviews: 124, location: "Phoenix, AZ", phone: "(602) 555-1234" },
      { name: "Nature's Design", rating: 4.7, reviews: 98, location: "Scottsdale, AZ", phone: "(480) 555-5678" },
      { name: "Outdoor Creations", rating: 4.9, reviews: 156, location: "Mesa, AZ", phone: "(480) 555-9012" },
      { name: "Pacific Garden Services", rating: 4.6, reviews: 87, location: "Tempe, AZ", phone: "(480) 555-3456" },
      { name: "Professional Yard Solutions", rating: 4.5, reviews: 65, location: "Gilbert, AZ", phone: "(480) 555-7890" },
      { name: "Desert Oasis Landscapes", rating: 4.8, reviews: 112, location: "Chandler, AZ", phone: "(480) 555-4321" }
    ]
  },
  "lawn-care": {
    title: "Lawn Care Services",
    icon: <LeafyGreen className="w-6 h-6 text-greenyp-500" />,
    description: "Find lawn care specialists offering mowing, fertilization, and lawn treatments",
    metaDescription: "Connect with trusted lawn care professionals. Compare services, prices, and customer reviews from lawn maintenance experts in your area.",
    providers: [
      { name: "Perfect Lawns Inc", rating: 4.9, reviews: 148, location: "Phoenix, AZ", phone: "(602) 555-2345" },
      { name: "Green Grass Experts", rating: 4.7, reviews: 89, location: "Scottsdale, AZ", phone: "(480) 555-6789" },
      { name: "Premier Lawn Services", rating: 4.8, reviews: 116, location: "Mesa, AZ", phone: "(480) 555-0123" },
      { name: "Turf Masters", rating: 4.6, reviews: 75, location: "Tempe, AZ", phone: "(480) 555-4567" },
      { name: "Healthy Lawn Company", rating: 4.7, reviews: 93, location: "Gilbert, AZ", phone: "(480) 555-8901" }
    ]
  },
  "hardscaping": {
    title: "Hardscaping Services",
    icon: <Shovel className="w-6 h-6 text-greenyp-500" />,
    description: "Find experts in patios, walkways, retaining walls, and outdoor structures",
    metaDescription: "Discover skilled hardscaping contractors for patios, walkways, retaining walls, and outdoor living spaces. Browse project galleries and get free quotes.",
    providers: [
      { name: "Stone & Patio Experts", rating: 4.9, reviews: 132, location: "Phoenix, AZ", phone: "(602) 555-3456" },
      { name: "Custom Hardscapes", rating: 4.8, reviews: 108, location: "Scottsdale, AZ", phone: "(480) 555-7890" },
      { name: "Outdoor Living Construction", rating: 4.7, reviews: 94, location: "Mesa, AZ", phone: "(480) 555-1234" },
      { name: "Paver Professionals", rating: 4.8, reviews: 127, location: "Tempe, AZ", phone: "(480) 555-5678" }
    ]
  },
  "nurseries": {
    title: "Plant Nurseries",
    icon: <TreeDeciduous className="w-6 h-6 text-greenyp-500" />,
    description: "Find plant nurseries offering trees, shrubs, and garden plants",
    metaDescription: "Explore local plant nurseries with extensive collections of trees, shrubs, perennials, and annuals. Find garden centers with expert advice for your garden.",
    providers: [
      { name: "Desert Garden Center", rating: 4.8, reviews: 165, location: "Phoenix, AZ", phone: "(602) 555-4567" },
      { name: "Green Valley Nursery", rating: 4.9, reviews: 187, location: "Scottsdale, AZ", phone: "(480) 555-8901" },
      { name: "Sunshine Plants & Trees", rating: 4.7, reviews: 134, location: "Mesa, AZ", phone: "(480) 555-2345" },
      { name: "Native Plants Nursery", rating: 4.8, reviews: 152, location: "Tempe, AZ", phone: "(480) 555-6789" }
    ]
  },
  "plant-suppliers": {
    title: "Plant Suppliers",
    icon: <Shrub className="w-6 h-6 text-greenyp-500" />,
    description: "Find suppliers of seeds, bulbs, and specialty plants",
    metaDescription: "Source high-quality seeds, bulbs, and specialty plants from verified suppliers. Find rare plants, organic gardening supplies, and expert growing advice.",
    providers: [
      { name: "Specialty Seeds Co", rating: 4.8, reviews: 118, location: "Phoenix, AZ", phone: "(602) 555-5678" },
      { name: "Rare Plant Emporium", rating: 4.9, reviews: 142, location: "Scottsdale, AZ", phone: "(480) 555-9012" },
      { name: "Organic Garden Supply", rating: 4.7, reviews: 96, location: "Mesa, AZ", phone: "(480) 555-3456" },
      { name: "Desert Adapted Plants", rating: 4.8, reviews: 129, location: "Tempe, AZ", phone: "(480) 555-7890" }
    ]
  },
  "water-features": {
    title: "Pond & Water Features",
    icon: <Droplets className="w-6 h-6 text-greenyp-500" />,
    description: "Find specialists in ponds, fountains, waterfalls, and irrigation systems",
    metaDescription: "Connect with water feature designers and installers. Get expert help with ponds, fountains, waterfalls, irrigation systems, and drainage solutions.",
    providers: [
      { name: "Water Garden Experts", rating: 4.9, reviews: 138, location: "Phoenix, AZ", phone: "(602) 555-6789" },
      { name: "Fountain & Pond Co", rating: 4.8, reviews: 105, location: "Scottsdale, AZ", phone: "(480) 555-0123" },
      { name: "Irrigation Specialists", rating: 4.7, reviews: 91, location: "Mesa, AZ", phone: "(480) 555-4567" },
      { name: "Waterfall Designs", rating: 4.8, reviews: 124, location: "Tempe, AZ", phone: "(480) 555-8901" }
    ]
  }
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? categoryData[slug as keyof typeof categoryData] : null;
  
  useEffect(() => {
    // Update document title for SEO
    if (category) {
      document.title = `${category.title} - GreenYP`;
      
      // Create meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', category.metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = category.metaDescription;
        document.head.appendChild(meta);
      }
    }
  }, [category]);
  
  if (!category) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-greenyp-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              {category.icon}
              <h1 className="text-3xl md:text-4xl font-bold ml-2 text-gray-900">{category.title}</h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">{category.description}</p>
            
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
        
        {/* Provider Listings */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Top {category.title} Providers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.providers.map((provider, index) => (
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
                  
                  <Button className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white mt-2">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-greenyp-100 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Are you a {category.title} professional?
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
