
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wrench } from 'lucide-react';
import { useServices } from '@/hooks/useServices';

interface ServicesListProps {
  producerId: string;
  locationId: string;
}

const ServicesList = ({ producerId, locationId }: ServicesListProps) => {
  const { data: servicesResponse, isLoading, error } = useServices(producerId, locationId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-greenyp-600" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading services...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !servicesResponse?.response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-greenyp-600" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No services available at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const services = servicesResponse.response;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wrench className="w-5 h-5 mr-2 text-greenyp-600" />
          Services ({services.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.producerServiceId} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{service.shortDescription}</h4>
                <div className="text-right">
                  {service.minServicePrice === service.maxServicePrice ? (
                    <span className="text-lg font-semibold text-greenyp-600">
                      ${service.minServicePrice}
                    </span>
                  ) : (
                    <span className="text-lg font-semibold text-greenyp-600">
                      ${service.minServicePrice} - ${service.maxServicePrice}
                    </span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    per {service.priceUnitsType?.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
              </div>
              {service.description && (
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
              )}
              {service.serviceTerms && (
                <p className="text-gray-500 text-xs">Terms: {service.serviceTerms}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
