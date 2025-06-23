
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, Globe, Clock, ExternalLink } from 'lucide-react';
import SearchResultsLayout from '@/components/search/SearchResultsLayout';
import type { ProducerProfileResponse, ProductsResponse, ServicesResponse } from '@/types/profile';

const ProfilePage = () => {
  const { producerId, producerLocationId } = useParams<{ producerId: string; producerLocationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [profile, setProfile] = useState<ProducerProfileResponse | null>(null);
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [services, setServices] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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
      if (!producerId || !producerLocationId) {
        setError('Invalid profile parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch profile data
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

        // Fetch products (optional)
        try {
          const productsUrl = `http://localhost:8081/producer/${producerId}/location/${producerLocationId}/products`;
          const productsResponse = await fetch(productsUrl);
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            setProducts(productsData);
          }
        } catch (err) {
          console.warn('Failed to fetch products:', err);
        }

        // Fetch services (optional)
        try {
          const servicesUrl = `http://localhost:8081/producer/${producerId}/location/${producerLocationId}/services`;
          const servicesResponse = await fetch(servicesUrl);
          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            setServices(servicesData);
          }
        } catch (err) {
          console.warn('Failed to fetch services:', err);
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

  // Loading state
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

  // Error state
  if (error || !profile) {
    return (
      <SearchResultsLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The requested profile could not be found.'}</p>
            <Button 
              variant="outline" 
              className="text-greenyp-600 border-greenyp-600 hover:bg-greenyp-50"
              onClick={handleBackClick}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </SearchResultsLayout>
    );
  }

  const profileInfo = profile.response;

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profileInfo.businessName}</h1>
          {profileInfo.locationName && (
            <p className="text-xl text-gray-600">{profileInfo.locationName}</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {profileInfo.businessNarrative && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profileInfo.businessNarrative}</p>
                </CardContent>
              </Card>
            )}

            {/* Products Section */}
            {products && products.response && products.response.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {products.response.map((product) => (
                      <div key={product.productId} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.description && (
                          <p className="text-gray-600 mb-2">{product.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-greenyp-600 font-medium">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.containerSize && (
                            <span className="text-sm text-gray-500">{product.containerSize}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Section */}
            {services && services.response && services.response.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {services.response.map((service) => (
                      <div key={service.producerServiceId} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg">{service.shortDescription}</h3>
                        {service.description && (
                          <p className="text-gray-600 mb-2">{service.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-greenyp-600 font-medium">
                            ${service.minServicePrice} - ${service.maxServicePrice}
                          </span>
                          <span className="text-sm text-gray-500">{service.priceUnitsType.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact & Hours */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                  <div>
                    {profileInfo.addressLine1 && <div>{profileInfo.addressLine1}</div>}
                    {profileInfo.addressLine2 && <div>{profileInfo.addressLine2}</div>}
                    {profileInfo.addressLine3 && <div>{profileInfo.addressLine3}</div>}
                    <div>{profileInfo.city}, {profileInfo.state} {profileInfo.postalCode}</div>
                  </div>
                </div>

                {/* Phone */}
                {profileInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-500" />
                    <a href={`tel:${profileInfo.phone}`} className="hover:text-greenyp-600">
                      {profileInfo.phone}
                    </a>
                  </div>
                )}

                {/* Cell Phone */}
                {profileInfo.cellPhone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-500" />
                    <a href={`tel:${profileInfo.cellPhone}`} className="hover:text-greenyp-600">
                      {profileInfo.cellPhone} (Cell)
                    </a>
                  </div>
                )}

                {/* Website */}
                {profileInfo.websiteUrl && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-3 text-gray-500" />
                    <a 
                      href={profileInfo.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-greenyp-600 flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            {profileInfo.locationHours && profileInfo.locationHours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profileInfo.locationHours.map((hour, index) => (
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
