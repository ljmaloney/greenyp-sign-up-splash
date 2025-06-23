
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ServicesResponse } from '@/types/profile';

interface ProfileServicesProps {
  services: ServicesResponse | null;
  hasFeature: (featureName: string) => boolean;
}

const ProfileServices = ({ services, hasFeature }: ProfileServicesProps) => {
  if (!hasFeature('services') || !services || services.response.length === 0) {
    return null;
  }

  return (
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
  );
};

export default ProfileServices;
