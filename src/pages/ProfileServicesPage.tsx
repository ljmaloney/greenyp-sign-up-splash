
import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/useProfileData';
import { useServices } from '@/hooks/useServices';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';

// Price unit mappings for better display
const getPriceUnitsDisplay = (priceUnitsType: string): string => {
  const mappings: Record<string, string> = {
    'LOT_SIZE': 'per lot size',
    'PER_HOUR': 'per hour',
    'PER_MILE': 'per mile',
    'PER_VISIT': 'per visit',
    'FIXED_ESTIMATE': 'fixed estimate'
  };
  
  return mappings[priceUnitsType] || priceUnitsType;
};

const ProfileServicesPage = () => {
  const params = useParams<{ producerId: string }>();
  const [searchParams] = useSearchParams();
  const { profile, isLoading: profileLoading, error: profileError } = useProfileData();
  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError } = useServices(profile?.producerId, profile?.locationId);

  if (profileLoading) {
    return <ProfileLoadingState />;
  }

  if (profileError && !profile) {
    return <ProfileErrorState />;
  }

  if (!profile) {
    return <ProfileErrorState />;
  }

  const services = servicesResponse?.response || [];
  
  // Use the producerLocationId from URL params for the back URL, preserving search parameters
  const producerLocationId = params.producerId; // This is actually the producerLocationId
  const backToProfileUrl = `/profile/${producerLocationId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return (
    <ProfilePageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              to={backToProfileUrl}
              className="inline-flex items-center text-greenyp-600 hover:text-greenyp-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Services</h1>
              <p className="text-gray-600">
                Available services at {profile.locationName || profile.businessName}
              </p>
            </div>

            {/* Services List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-greenyp-600" />
                  Services ({services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <p className="text-gray-600">Loading services...</p>
                ) : servicesError ? (
                  <p className="text-red-600">Error loading services. Please try again.</p>
                ) : services.length === 0 ? (
                  <p className="text-gray-600">No services available at this time.</p>
                ) : (
                  <div className="space-y-6">
                    {services.map((service) => (
                      <div key={service.producerServiceId} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{service.shortDescription}</h3>
                          <div className="text-right">
                            {service.minServicePrice === service.maxServicePrice ? (
                              <span className="text-2xl font-bold text-greenyp-600">
                                ${service.minServicePrice}
                              </span>
                            ) : (
                              <span className="text-2xl font-bold text-greenyp-600">
                                ${service.minServicePrice} - ${service.maxServicePrice}
                              </span>
                            )}
                            <p className="text-sm text-gray-500">
                              {getPriceUnitsDisplay(service.priceUnitsType)}
                            </p>
                          </div>
                        </div>
                        
                        {service.description && (
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-1">Description:</h4>
                            <p className="text-gray-600">{service.description}</p>
                          </div>
                        )}
                        
                        {service.serviceTerms && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">Service Terms:</h4>
                            <p className="text-gray-600 text-sm">{service.serviceTerms}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </ProfilePageLayout>
  );
};

export default ProfileServicesPage;
