
import React from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import { ProducerService } from "@/types/profile";

interface ServiceLocationGroupProps {
  locationId: string;
  locationServices: ProducerService[];
  locations: { id: string; name: string; address: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onEditService: (service: any) => void;
  onDeleteService: (serviceId: string) => void;
  onAddService: (locationId: string) => void;
}

const ServiceLocationGroup = ({ 
  locationId, 
  locationServices, 
  locations, 
  isOpen, 
  onToggle, 
  onEditService, 
  onDeleteService,
  onAddService
}: ServiceLocationGroupProps) => {
  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'No Location';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  const locationName = getLocationName(locationId === 'no-location' ? undefined : locationId);
  const hasMultipleServices = locationServices.length > 1;

  const getPriceUnitsDisplay = (priceUnitsType?: string): string => {
    if (!priceUnitsType) {
      return 'per service';
    }
    
    const mappings: Record<string, string> = {
      'LOT_SIZE': 'per lot size',
      'PER_HOUR': 'per hour',
      'PER_MILE': 'per mile',
      'PER_MILE_RANGE': 'per mile (range)',
      'PER_VISIT': 'per visit',
      'FIXED_ESTIMATE': 'per estimate'
    };
    
    return mappings[priceUnitsType] || priceUnitsType.toLowerCase().replace('_', ' ');
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <Collapsible open={isOpen} onOpenChange={() => hasMultipleServices && onToggle()}>
        <div className="bg-greenyp-50 p-4 border-b border-greenyp-100">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <div className={`flex items-center flex-1 ${hasMultipleServices ? 'cursor-pointer' : 'cursor-default'}`}>
                <MapPin className="w-4 h-4 mr-2 text-greenyp-600" />
                <h3 className="font-semibold text-gray-900">{locationName}</h3>
                <span className="ml-2 text-sm text-gray-500">({locationServices.length} service{locationServices.length !== 1 ? 's' : ''})</span>
                {hasMultipleServices && (
                  <div className="ml-2">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAddService(locationId)}
              className="ml-4 bg-greenyp-700 hover:bg-greenyp-800 text-white border-greenyp-700 hover:border-greenyp-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="divide-y bg-white">
            {locationServices.map((service) => (
              <div key={service.producerServiceId} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
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
                      <p className="text-gray-600 text-sm mb-1">{service.description}</p>
                    )}
                    {service.serviceTerms && (
                      <p className="text-gray-500 text-xs">Terms: {service.serviceTerms}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditService(service)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteService(service.producerServiceId)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ServiceLocationGroup;
