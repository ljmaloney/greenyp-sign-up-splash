
import React from 'react';
import ServiceLocationGroup from './ServiceLocationGroup';
import { ServiceResponse } from '@/services/servicesService';

interface ServicesContentProps {
  groupedServices: Record<string, ServiceResponse[]>;
  locations: { id: string; name: string; address: string }[];
  openGroups: Record<string, boolean>;
  onToggleGroup: (locationId: string) => void;
  onEditService: (service: ServiceResponse) => void;
  onDeleteService: (serviceId: string) => void;
  onAddService: (locationId: string) => void;
}

const ServicesContent = ({
  groupedServices,
  locations,
  openGroups,
  onToggleGroup,
  onEditService,
  onDeleteService,
  onAddService
}: ServicesContentProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No locations found. Please add a location first.</p>
        <a href="/dashboard/locations" className="text-blue-600 hover:underline">
          Go to Locations
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locations.map((location) => {
        const locationServices = groupedServices[location.id] || [];
        const hasServices = locationServices.length > 0;
        
        return (
          <ServiceLocationGroup
            key={location.id}
            locationId={location.id}
            locationServices={locationServices}
            locations={locations}
            isOpen={openGroups[location.id] || !hasServices}
            onToggle={() => onToggleGroup(location.id)}
            onEditService={onEditService}
            onDeleteService={onDeleteService}
            onAddService={onAddService}
            hasServices={hasServices}
          />
        );
      })}
    </div>
  );
};

export default ServicesContent;
