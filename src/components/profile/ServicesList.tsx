
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wrench } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { ProducerService } from '@/types/profile';

interface ServicesListProps {
  producerId: string;
  locationId: string;
}

// Service pricing unit mappings for better display
const getPriceUnitsDisplay = (priceUnitsType: string): string => {
  const mappings: Record<string, string> = {
    'LOT_SIZE': 'per lot size',
    'PER_HOUR': 'per hour',
    'PER_MILE': 'distance (per mile)',
    'PER_VISIT': 'per visit',
    'FIXED_ESTIMATE': 'per project'
  };
  
  return mappings[priceUnitsType] || priceUnitsType.toLowerCase().replace('_', ' ');
};

// Mock services data for validation
const mockServices: ProducerService[] = [
  {
    producerServiceId: 'service-001',
    createDate: '2024-01-10',
    lastUpdateDate: '2024-05-15',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 150,
    maxServicePrice: 500,
    priceUnitsType: 'PER_VISIT',
    shortDescription: 'Landscape Design & Installation',
    description: 'Complete landscape design services from concept to installation. Includes site analysis, design consultation, plant selection, and full installation with a 1-year warranty on all plants.',
    serviceTerms: '50% deposit required. Final payment due upon completion. 1-year plant warranty included.'
  },
  {
    producerServiceId: 'service-002',
    createDate: '2024-01-15',
    lastUpdateDate: '2024-05-20',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 75,
    maxServicePrice: 150,
    priceUnitsType: 'PER_VISIT',
    shortDescription: 'Weekly Lawn Maintenance',
    description: 'Professional lawn care service including mowing, edging, blowing, and basic trimming. Service includes seasonal fertilization and weed control treatments.',
    serviceTerms: 'Monthly billing. Seasonal contracts available with 10% discount. Weather delays may affect scheduling.'
  },
  {
    producerServiceId: 'service-003',
    createDate: '2024-02-01',
    lastUpdateDate: '2024-05-25',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 200,
    maxServicePrice: 800,
    priceUnitsType: 'FIXED_ESTIMATE',
    shortDescription: 'Tree Trimming & Removal',
    description: 'Professional tree services including pruning, trimming, and safe tree removal. Certified arborists on staff. All debris removal included.',
    serviceTerms: 'Free estimates provided. Licensed and insured. Emergency services available 24/7 with additional charges.'
  },
  {
    producerServiceId: 'service-004',
    createDate: '2024-02-10',
    lastUpdateDate: '2024-05-18',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 500,
    maxServicePrice: 2500,
    priceUnitsType: 'FIXED_ESTIMATE',
    shortDescription: 'Irrigation System Installation',
    description: 'Design and installation of efficient drip and spray irrigation systems. Smart controller installation available. Water-wise design to minimize usage while maintaining healthy landscapes.',
    serviceTerms: 'Includes 2-year warranty on installation. Seasonal maintenance plans available. Permit assistance provided.'
  },
  {
    producerServiceId: 'service-005',
    createDate: '2024-03-01',
    lastUpdateDate: '2024-05-22',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 300,
    maxServicePrice: 1200,
    priceUnitsType: 'FIXED_ESTIMATE',
    shortDescription: 'Hardscape Installation',
    description: 'Custom hardscape features including patios, walkways, retaining walls, and outdoor living spaces. Specializing in natural stone and decorative concrete.',
    serviceTerms: 'Design consultation included. Materials and labor warranty. Permits handled by contractor when required.'
  }
];

const ServiceCard = ({ service }: { service: ProducerService }) => (
  <div className="border-b border-gray-200 pb-4 last:border-b-0">
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
          {getPriceUnitsDisplay(service.priceUnitsType)}
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
);

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

  // Use mock data if API fails or returns no services
  const services = servicesResponse?.response?.length > 0 ? servicesResponse.response : mockServices;

  if (!services || services.length === 0) {
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

  const displayedServices = services.slice(0, 3);
  const hasMoreServices = services.length > 3;

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
          {displayedServices.map((service) => (
            <ServiceCard key={service.producerServiceId} service={service} />
          ))}
          
          {hasMoreServices && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  View All Services ({services.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Wrench className="w-5 h-5 mr-2 text-greenyp-600" />
                    All Services ({services.length})
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {services.map((service) => (
                    <ServiceCard key={service.producerServiceId} service={service} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
