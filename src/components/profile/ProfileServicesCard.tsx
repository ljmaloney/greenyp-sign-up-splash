
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { ProducerProfile } from '@/types/profile';

interface ProfileServicesCardProps {
  profile: ProducerProfile;
}

const ProfileServicesCard = ({ profile }: ProfileServicesCardProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: servicesResponse, isLoading } = useServices(profile.producerId, profile.locationId);

  // Check if any of the profile's subscriptions have services feature
  const hasServicesFeature = profile.subscriptionIds.some(subscriptionId => {
    const subscription = subscriptions?.find(sub => sub.subscriptionId === subscriptionId);
    return subscription?.features.some(feature => feature.feature === 'services');
  });

  if (!hasServicesFeature) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
            <Wrench className="w-5 h-5" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading services...</p>
        </CardContent>
      </Card>
    );
  }

  const services = servicesResponse?.response || [];
  const displayServices = services.slice(0, 5);
  const hasMoreServices = services.length > 5;

  const formatPriceRange = (service: any) => {
    if (service.minServicePrice === service.maxServicePrice) {
      return `$${service.minServicePrice}`;
    }
    return `$${service.minServicePrice} - $${service.maxServicePrice}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
          <Wrench className="w-5 h-5" />
          Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayServices.length > 0 ? (
          <div className="space-y-3">
            {displayServices.map((service) => (
              <div key={service.producerServiceId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="text-left">
                  <p className="font-medium text-gray-900">{service.shortDescription}</p>
                  {service.description && (
                    <p className="text-sm text-gray-600">{service.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPriceRange(service)}</p>
                </div>
              </div>
            ))}
            {hasMoreServices && (
              <div className="pt-3 text-center">
                <Link 
                  to={`/profile/${profile.producerId}/${profile.locationId}/services`}
                  className="text-greenyp-600 hover:text-greenyp-700 underline"
                >
                  More Services ...
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No services available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileServicesCard;
