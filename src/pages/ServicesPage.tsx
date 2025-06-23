
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useServices } from '@/hooks/useServices';
import { useProducerProfile } from '@/hooks/useProfile';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';

const ServicesPage = () => {
  const { producerId, producerLocationId } = useParams<{ 
    producerId: string;
    producerLocationId: string; 
  }>();
  
  const { data: profileResponse } = useProducerProfile(producerLocationId!);
  const { data: servicesResponse, isLoading, error } = useServices(producerId, producerLocationId);

  const profile = profileResponse?.response;
  const services = servicesResponse?.response || [];

  const formatPriceRange = (service: any) => {
    if (service.minServicePrice === service.maxServicePrice) {
      return `$${service.minServicePrice}`;
    }
    return `$${service.minServicePrice} - $${service.maxServicePrice}`;
  };

  if (isLoading) {
    return (
      <ProfilePageLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-gray-600">Loading services...</p>
        </div>
      </ProfilePageLayout>
    );
  }

  if (error) {
    return (
      <ProfilePageLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-red-600">Error loading services</p>
        </div>
      </ProfilePageLayout>
    );
  }

  return (
    <ProfilePageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link to={`/profile/${producerId}/${producerLocationId}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.businessName || 'Business'} Services
          </h1>
          {profile?.locationName && profile.locationName !== profile.businessName && (
            <p className="text-lg text-gray-600">{profile.locationName}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
              <Wrench className="w-5 h-5" />
              All Services ({services.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.producerServiceId} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                    <div className="text-left flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{service.shortDescription}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      )}
                      {service.serviceTerms && (
                        <p className="text-xs text-gray-500">Terms: {service.serviceTerms}</p>
                      )}
                      <p className="text-xs text-gray-500">Price Type: {service.priceUnitsType}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-gray-900 text-lg">{formatPriceRange(service)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No services available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProfilePageLayout>
  );
};

export default ServicesPage;
