
import React from 'react';
import ServiceLocationGroup from './ServiceLocationGroup';

interface ServicesContentProps {
  groupedServices: Record<string, any[]>;
  locations: { id: string; name: string; address: string }[];
  openGroups: Record<string, boolean>;
  onToggleGroup: (locationId: string) => void;
  onEditService: (service: any) => void;
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
  return (
    <div className="space-y-4">
      {Object.entries(groupedServices).map(([locationId, locationServices]) => (
        <ServiceLocationGroup
          key={locationId}
          locationId={locationId}
          locationServices={locationServices}
          locations={locations}
          isOpen={openGroups[locationId] || locationServices.length === 1}
          onToggle={() => onToggleGroup(locationId)}
          onEditService={onEditService}
          onDeleteService={onDeleteService}
          onAddService={onAddService}
        />
      ))}
    </div>
  );
};

export default ServicesContent;
