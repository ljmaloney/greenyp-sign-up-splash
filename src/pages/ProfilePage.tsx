import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, Globe, Clock, ExternalLink } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/config/api';
import type { ProducerProfileResponse, ProductsResponse, ServicesResponse } from '@/types/profile';

const ProfilePage = () => {
  const { producerId, producerLocationId } = useParams<{ producerId: string; producerLocationId: string }>();
  const [profile, setProfile] = useState<ProducerProfileResponse | null>(null);
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if subscription has specific feature
  const hasFeature = (featureName: string): boolean => {
    // For now, we'll assume all profiles have both features
    // In a real implementation, you would check the subscription features
    return true;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!producerId || !producerLocationId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch profile data using the correct API configuration
        const profileUrl = getApiUrl(`/profile/${producerId}/location/${producerLocationId}`);
        console.log('Fetching profile from:', profileUrl);
        
        const profileResponse = await fetch(profileUrl);
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }
        
        const profileData: ProducerProfileResponse = await profileResponse.json();
        setProfile(profileData);

        // Fetch products if feature exists
        if (hasFeature('products')) {
          try {
            const productsUrl = getApiUrl(`/producer/${producerId}/location/${producerLocationId}/products`);
            console.log('Fetching products from:', productsUrl);
            
            const productsResponse = await fetch(productsUrl);
            if (productsResponse.ok) {
              const productsData: ProductsResponse = await productsResponse.json();
              setProducts(productsData);
            }
          } catch (err) {
            console.warn('Failed to fetch products:', err);
          }
        }

        // Fetch services if feature exists
        if (hasFeature('services')) {
          try {
            const servicesUrl = getApiUrl(`/producer/${producerId}/location/${producerLocationId}/services`);
            console.log('Fetching services from:', servicesUrl);
            
            const servicesResponse = await fetch(servicesUrl);
            if (servicesResponse.ok) {
              const servicesData: ServicesResponse = await servicesResponse.json();
              setServices(servicesData);
            }
          } catch (err) {
            console.warn('Failed to fetch services:', err);
          }
        }

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [producerId, producerLocationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenyp-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested profile could not be found.'}</p>
            <Link to="/search">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const profileData = profile.response;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/search">
              <Button variant="outline" className="text-greenyp-600 border-greenyp-600 hover:bg-greenyp-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.businessName}</h1>
                  {profileData.locationName && (
                    <p className="text-lg text-gray-600">{profileData.locationName}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>
                        {profileData.addressLine1}
                        {profileData.addressLine2 && `, ${profileData.addressLine2}`}
                        <br />
                        {profileData.city}, {profileData.state} {profileData.postalCode}
                      </span>
                    </div>
                    
                    {profileData.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <a href={`tel:${profileData.phone}`} className="hover:text-greenyp-600">
                          {profileData.phone}
                        </a>
                      </div>
                    )}

                    {profileData.cellPhone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <a href={`tel:${profileData.cellPhone}`} className="hover:text-greenyp-600">
                          {profileData.cellPhone} (Cell)
                        </a>
                      </div>
                    )}
                    
                    {profileData.websiteUrl && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                        <a 
                          href={profileData.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-greenyp-600 flex items-center"
                        >
                          {profileData.websiteUrl}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Hours */}
                {profileData.locationHours && profileData.locationHours.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                    <div className="space-y-1">
                      {profileData.locationHours.map((hour, index) => (
                        <div key={index} className="flex justify-between text-gray-600">
                          <span className="capitalize">{hour.dayOfWeek.toLowerCase()}</span>
                          <span>{hour.openTime} - {hour.closeTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Business Description */}
              {profileData.businessNarrative && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">{profileData.businessNarrative}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Section */}
          {hasFeature('products') && products && products.response.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {products.response.slice(0, 6).map((product) => (
                    <div key={product.productId} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Type: {product.productType.replace('_', ' ')}</span>
                            {product.containerSize && <span>Size: {product.containerSize}</span>}
                            {product.availableQuantity > 0 && <span>Available: {product.availableQuantity}</span>}
                          </div>
                        </div>
                        {product.price > 0 && (
                          <div className="text-right">
                            <span className="text-lg font-semibold text-greenyp-600">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {products.response.length > 6 && (
                  <div className="text-center mt-4">
                    <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                      View All Products ({products.response.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Services Section */}
          {hasFeature('services') && services && services.response.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {services.response.slice(0, 6).map((service) => (
                    <div key={service.producerServiceId} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">{service.shortDescription}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          {service.serviceTerms && (
                            <p className="text-xs text-gray-500 mt-2">{service.serviceTerms}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {service.minServicePrice > 0 && service.maxServicePrice > 0 && (
                            <span className="text-lg font-semibold text-greenyp-600">
                              ${service.minServicePrice} - ${service.maxServicePrice}
                            </span>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {service.priceUnitsType.replace('_', ' ').toLowerCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {services.response.length > 6 && (
                  <div className="text-center mt-4">
                    <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                      View All Services ({services.response.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
