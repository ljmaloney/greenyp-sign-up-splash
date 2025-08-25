
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import { ServiceResponse } from '@/services/servicesService';

interface ServiceLocationGroupProps {
  locationId: string;
  locationServices: ServiceResponse[];
  locations: { id: string; name: string; address: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onEditService: (service: ServiceResponse) => void;
  onDeleteService: (serviceId: string) => void;
  onAddService: (locationId: string) => void;
  hasServices: boolean;
  showDisabled: boolean;
  onToggleShowDisabled: () => void;
}

const ServiceLocationGroup = ({ 
  locationId, 
  locationServices, 
  locations, 
  isOpen, 
  onToggle, 
  onEditService, 
  onDeleteService,
  onAddService,
  hasServices,
  showDisabled,
  onToggleShowDisabled
}: ServiceLocationGroupProps) => {
  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'No Location';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  const locationName = getLocationName(locationId === 'no-location' ? undefined : locationId);

  // Filter services based on showDisabled state
  const visibleServices = showDisabled 
    ? locationServices 
    : locationServices.filter(service => !service.discontinued);

  const getPriceUnitsDisplay = (priceUnitsType: string): string => {
    const mappings: Record<string, string> = {
      'LOT_SIZE': 'per lot size',
      'PER_HOUR': 'per hour',
      'PER_MILE': 'per mile',
      'PER_VISIT': 'per visit',
      'FIXED_ESTIMATE': 'fixed estimate'
    };
    
    return mappings[priceUnitsType] || priceUnitsType.toLowerCase().replace('_', ' ');
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <div className="bg-greenyp-50 p-4 border-b border-greenyp-100">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <div className="flex items-center flex-1 cursor-pointer">
                <MapPin className="w-4 h-4 mr-2 text-greenyp-600" />
                <h3 className="font-semibold text-gray-900">{locationName}</h3>
                <span className="ml-2 text-sm text-gray-500">
                  ({visibleServices.length} service{visibleServices.length !== 1 ? 's' : ''})
                </span>
                <div className="ml-2">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                </div>
              </div>
            </CollapsibleTrigger>
            <div className="flex items-center gap-3">
              {locationServices.some(service => service.discontinued) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Show disabled</span>
                  <Switch
                    checked={showDisabled}
                    onCheckedChange={onToggleShowDisabled}
                  />
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAddService(locationId)}
                className="bg-greenyp-700 hover:bg-greenyp-800 text-white border-greenyp-700 hover:border-greenyp-800"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="divide-y bg-white">
            {!hasServices ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No Services Configured</p>
              </div>
            ) : visibleServices.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No active services. Toggle "Show disabled" to see discontinued services.</p>
              </div>
            ) : (
              visibleServices.map((service) => {
                const isDisabled = service.discontinued;

                return (
                  <div key={service.producerServiceId} className={`p-4 ${isDisabled ? 'opacity-75 bg-gray-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${
                              isDisabled ? 'text-gray-500' : 'text-gray-900'
                            }`}>{service.shortDescription}</h4>
                            {service.discontinued && (
                              <Badge 
                                variant="secondary"
                                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                Discontinued
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            {service.minServicePrice === service.maxServicePrice ? (
                              <span className={`text-lg font-semibold ${
                                isDisabled ? 'text-gray-400' : 'text-greenyp-600'
                              }`}>
                                ${service.minServicePrice}
                              </span>
                            ) : (
                              <span className={`text-lg font-semibold ${
                                isDisabled ? 'text-gray-400' : 'text-greenyp-600'
                              }`}>
                                ${service.minServicePrice} - ${service.maxServicePrice}
                              </span>
                            )}
                            <span className={`text-xs mt-1 ${
                              isDisabled ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              &nbsp;{getPriceUnitsDisplay(service.priceUnitsType)}
                            </span>
                          </div>
                        </div>
                        {service.description && (
                          <p className={`text-sm mb-2 ${
                            isDisabled ? 'text-gray-500' : 'text-gray-600'
                          }`}>{service.description}</p>
                        )}
                        {service.serviceTerms && (
                          <p className={`text-xs ${
                            isDisabled ? 'text-gray-400' : 'text-gray-500'
                          }`}>Terms: {service.serviceTerms}</p>
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
                          <Trash2 className="w-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ServiceLocationGroup;
