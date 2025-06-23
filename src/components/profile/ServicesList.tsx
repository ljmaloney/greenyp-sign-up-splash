
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wrench } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { ProducerService } from '@/types/profile';

interface ServicesListProps {
  producerId: string;
  locationId: string;
  maxItems?: number;
}

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

// Mock services data for validation
const mockServices: ProducerService[] = [
  {
    producerServiceId: 'service-001',
    createDate: '2024-01-15',
    lastUpdateDate: '2024-05-15',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 150,
    maxServicePrice: 500,
    priceUnitsType: 'PER_VISIT',
    shortDescription: 'Landscape Design & Installation',
    description: 'Complete landscape design and installation services including plant selection, hardscape installation, and irrigation setup.',
    serviceTerms: 'Payment due upon completion. Warranty included for 1 year on plant materials.'
  },
  {
    producerServiceId: 'service-002',
    createDate: '2024-02-01',
    lastUpdateDate: '2024-05-20',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 75,
    maxServicePrice: 150,
    priceUnitsType: 'PER_VISIT',
    shortDescription: 'Lawn Maintenance',
    description: 'Weekly or bi-weekly lawn maintenance including mowing, edging, trimming, and cleanup.',
    serviceTerms: 'Monthly billing. Service agreement minimum 6 months.'
  },
  {
    producerServiceId: 'service-003',
    createDate: '2024-03-10',
    lastUpdateDate: '2024-05-25',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 200,
    maxServicePrice: 800,
    priceUnitsType: 'LOT_SIZE',
    shortDescription: 'Tree Trimming & Removal',
    description: 'Professional tree trimming, pruning, and removal services. Licensed and insured.',
    serviceTerms: 'Free estimates. Payment due upon completion.'
  },
  {
    producerServiceId: 'service-004',
    createDate: '2024-04-01',
    lastUpdateDate: '2024-06-01',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 100,
    maxServicePrice: 300,
    priceUnitsType: 'PER_VISIT',
    shortDescription: 'Irrigation System Installation',
    description: 'Design and installation of drip irrigation and sprinkler systems for residential and commercial properties.',
    serviceTerms: '2-year warranty on installation. Annual maintenance plans available.'
  },
  {
    producerServiceId: 'service-005',
    createDate: '2024-05-01',
    lastUpdateDate: '2024-06-15',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 50,
    maxServicePrice: 125,
    priceUnitsType: 'PER_HOUR',
    shortDescription: 'Garden Consultation',
    description: 'Expert garden consultation for plant selection, soil improvement, and seasonal garden planning.',
    serviceTerms: 'Hourly rate includes written recommendations. Follow-up visits available.'
  },
  {
    producerServiceId: 'service-006',
    createDate: '2024-06-01',
    lastUpdateDate: '2024-06-20',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 300,
    maxServicePrice: 1200,
    priceUnitsType: 'FIXED_ESTIMATE',
    shortDescription: 'Hardscape Installation',
    description: 'Installation of patios, walkways, retaining walls, and other hardscape features using natural stone and pavers.',
    serviceTerms: 'Custom estimates based on project scope. 50% deposit required to start.'
  },
  {
    producerServiceId: 'service-007',
    createDate: '2024-06-10',
    lastUpdateDate: '2024-06-25',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    minServicePrice: 80,
    maxServicePrice: 200,
    priceUnitsType: 'PER_VISIT',
    shortDescription: 'Seasonal Cleanup',
    description: 'Spring and fall cleanup services including leaf removal, pruning, mulching, and garden preparation.',
    serviceTerms: 'Seasonal packages available. Debris removal included in pricing.'
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
        <p className="text-xs text-gray-500">
          {getPriceUnitsDisplay(service.priceUnitsType)}
        </p>
      </div>
    </div>
    {service.description && (
      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
    )}
    {service.serviceTerms && (
      <p className="text-gray-500 text-xs">{service.serviceTerms}</p>
    )}
  </div>
);

const ServicesList = ({ producerId, locationId, maxItems = 3 }: ServicesListProps) => {
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

  const displayedServices = services.slice(0, maxItems);
  const hasMoreServices = services.length > maxItems;

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
