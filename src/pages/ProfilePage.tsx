
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, Globe, Clock, ExternalLink } from 'lucide-react';
import SearchResultsLayout from '@/components/search/SearchResultsLayout';
import { getApiUrl } from '@/config/api';
import type { ProducerProfileResponse, ProductsResponse, ServicesResponse } from '@/types/profile';

const ProfilePage = () => {
  const { producerId, producerLocationId } = useParams<{ producerId: string; producerLocationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<ProducerProfileResponse | null>(null);
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFeature = (featureName: string): boolean => {
    return true;
  };

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/search');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!producerId || !producerLocationId) return;

      setLoading(true);
      setError(null);

      try {
        const profileUrl = `http://localhost:8081/profile/${producerId}/location/${producerLocationId}`;
        console.log('Fetching profile from:', profileUrl);
        
        const profileResponse = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }
        
        const profileData: ProducerProfileResponse = await profileResponse.json();
        console.log('Profile data received:', profileData);
        setProfile(profileData);

        if (hasFeature('products')) {
          try {
            const productsUrl = `http://localhost:8081/producer/${producerId}/location/${producerLocationId}/products`;
            console.log('Fetching products from:', productsUrl);
            
            const productsResponse = await fetch(productsUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (productsResponse.ok) {
              const productsData: ProductsResponse = await productsResponse.json();
              setProducts(productsData);
            }
          } catch (err) {
            console.warn('Failed to fetch products:', err);
          }
        }

        if (hasFeature('services')) {
          try {
            const servicesUrl = `http://localhost:8081/producer/${producerId}/location/${producerLocationId}/services`;
            console.log('Fetching services from:', servicesUrl);
            
            const servicesResponse = await fetch(servicesUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
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
      <SearchResultsLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenyp-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        </div>
      </SearchResultsLayout>
    );
  }

  if (error || !profile) {
    return (
      <SearchResultsLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested profile could not be found.'}</p>
            <Button 
              onClick={handleBackClick}
              className="bg-greenyp-600 hover:bg-greenyp-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </SearchResultsLayout>
    );
  }

  const profileData = profile.response;

  return (
    <SearchResultsLayout>
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="text-greenyp-600 border-greenyp-600 hover:bg-greenyp-50"
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profileData.businessName}</h1>
          {profileData.locationName && (
            <p className="text-xl text-gray-600">{profileData.locationName}</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Description */}
            {profileData.businessNarrative && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profileData.businessNarrative}</p>
                </CardContent>
              </Card>
            )}

            {/* Products Section */}
            {hasFeature('products') && products && products.response.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Products
                    <span className="text-sm font-normal text-gray-500">
                      {products.response.length} item{products.response.length !== 1 ? 's' : ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.response.slice(0, 6).map((product) => (
                      <div key={product.productId} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-gray-600 mt-1">{product.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>Type: {product.productType.replace('_', ' ')}</span>
                              {product.containerSize && <span>Size: {product.containerSize}</span>}
                              {product.availableQuantity > 0 && <span>Available: {product.availableQuantity}</span>}
                            </div>
                          </div>
                          {product.price > 0 && (
                            <div className="text-right ml-4">
                              <span className="text-lg font-bold text-greenyp-600">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {products.response.length > 6 && (
                    <div className="text-center mt-6">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Services
                    <span className="text-sm font-normal text-gray-500">
                      {services.response.length} service{services.response.length !== 1 ? 's' : ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.response.slice(0, 6).map((service) => (
                      <div key={service.producerServiceId} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <h4 className="font-semibold text-gray-900">{service.shortDescription}</h4>
                            <p className="text-gray-600 mt-1">{service.description}</p>
                            {service.serviceTerms && (
                              <p className="text-sm text-gray-500 mt-2">{service.serviceTerms}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            {service.minServicePrice > 0 && service.maxServicePrice > 0 && (
                              <div>
                                <span className="text-lg font-bold text-greenyp-600">
                                  ${service.minServicePrice} - ${service.maxServicePrice}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                  {service.priceUnitsType.replace('_', ' ').toLowerCase()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {services.response.length > 6 && (
                    <div className="text-center mt-6">
                      <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                        View All Services ({services.response.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact & Hours */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{profileData.addressLine1}</p>
                    {profileData.addressLine2 && <p>{profileData.addressLine2}</p>}
                    <p>{profileData.city}, {profileData.state} {profileData.postalCode}</p>
                  </div>
                </div>
                
                {profileData.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                    <a href={`tel:${profileData.phone}`} className="hover:text-greenyp-600 transition-colors">
                      {profileData.phone}
                    </a>
                  </div>
                )}

                {profileData.cellPhone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                    <a href={`tel:${profileData.cellPhone}`} className="hover:text-greenyp-600 transition-colors">
                      {profileData.cellPhone} (Cell)
                    </a>
                  </div>
                )}
                
                {profileData.websiteUrl && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-5 h-5 mr-3 flex-shrink-0" />
                    <a 
                      href={profileData.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-greenyp-600 transition-colors flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            {profileData.locationHours && profileData.locationHours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profileData.locationHours.map((hour, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="font-medium capitalize text-gray-700">
                          {hour.dayOfWeek.toLowerCase()}
                        </span>
                        <span className="text-gray-600">
                          {hour.openTime} - {hour.closeTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SearchResultsLayout>
  );
};

export default ProfilePage;
