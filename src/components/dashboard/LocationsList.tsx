
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Plus, Edit, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import AddLocationDialog from './AddLocationDialog';
import EditLocationDialog from './EditLocationDialog';
import LocationHoursSection from './LocationHoursSection';

interface Location {
  id: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  websiteUrl?: string;
  // Computed properties for backward compatibility
  name: string;
  address: string;
  phone: string;
  isPrimary: boolean;
}

// Interface for the form data returned by dialogs
interface LocationFormData {
  locationId?: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  websiteUrl?: string;
}

const LocationsList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [openHours, setOpenHours] = useState<{ [key: string]: boolean }>({});
  
  // Mock locations data
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      locationName: 'Main Office',
      name: 'Main Office',
      address: '123 Garden Street, San Francisco, CA 94102',
      phone: '(555) 123-4567',
      isPrimary: true,
      locationType: 'HOME_OFFICE_PRIMARY',
      locationDisplayType: 'DISPLAY_WITH_MAP',
      active: true,
      addressLine1: '123 Garden Street',
      addressLine2: '',
      addressLine3: '',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      latitude: '37.7749',
      longitude: '-122.4194',
      websiteUrl: 'www.greenlandscaping.com'
    },
    {
      id: '2',
      locationName: 'Warehouse',
      name: 'Warehouse',
      address: '456 Industrial Blvd, San Francisco, CA 94103',
      phone: '(555) 123-4568',
      isPrimary: false,
      locationType: 'WAREHOUSE',
      locationDisplayType: 'NO_DISPLAY',
      active: true,
      addressLine1: '456 Industrial Blvd',
      addressLine2: '',
      addressLine3: '',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      latitude: '37.7849',
      longitude: '-122.4094'
    }
  ]);

  // Helper function to create full address from address components
  const getFullAddress = (location: Location) => {
    const parts = [
      location.addressLine1,
      location.addressLine2,
      location.addressLine3
    ].filter(Boolean);
    
    return `${parts.join(', ')}, ${location.city}, ${location.state} ${location.postalCode}`;
  };

  const toggleHours = (locationId: string) => {
    setOpenHours(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  const hasMultipleLocations = locations.length > 1;

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid gap-6">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
                  <div className="flex items-center space-x-3 flex-1">
                    <span>{location.locationName}</span>
                    {location.websiteUrl && (
                      <span className="text-sm text-gray-500">{location.websiteUrl}</span>
                    )}
                    {location.locationType === 'HOME_OFFICE_PRIMARY' && (
                      <span className="ml-2 px-2 py-1 bg-greenyp-100 text-greenyp-700 text-xs rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingLocation(location)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-600">{getFullAddress(location)}</p>
                    {location.phone && (
                      <span className="text-gray-600">• {location.phone}</span>
                    )}
                  </div>
                </div>
                
                {/* Business Hours Section */}
                <div className="border-t pt-4">
                  {hasMultipleLocations ? (
                    <Collapsible open={openHours[location.id]} onOpenChange={() => toggleHours(location.id)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="flex items-center p-0 h-auto text-left">
                          {openHours[location.id] ? (
                            <ChevronDown className="w-4 h-4 mr-2 text-greenyp-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-2 text-greenyp-600" />
                          )}
                          <Clock className="w-4 h-4 mr-2 text-greenyp-600" />
                          <h4 className="font-medium">Business Hours</h4>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <LocationHoursSection locationId={location.id} />
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <div>
                      <div className="flex items-center mb-3">
                        <Clock className="w-4 h-4 mr-2 text-greenyp-600" />
                        <h4 className="font-medium">Business Hours</h4>
                      </div>
                      <LocationHoursSection locationId={location.id} />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddLocationDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onLocationAdded={(newLocation: LocationFormData) => {
          const locationWithDefaults = {
            ...newLocation,
            id: Date.now().toString(),
            locationName: newLocation.locationName,
            name: newLocation.locationName,
            address: `${newLocation.addressLine1}, ${newLocation.city}, ${newLocation.state} ${newLocation.postalCode}`,
            phone: '(555) 123-4567', // Default phone for now
            isPrimary: newLocation.locationType === 'HOME_OFFICE_PRIMARY'
          };
          setLocations(prev => [...prev, locationWithDefaults]);
        }}
      />

      {editingLocation && (
        <EditLocationDialog 
          isOpen={!!editingLocation}
          onClose={() => setEditingLocation(null)}
          location={editingLocation}
          onLocationUpdated={(updatedLocation: LocationFormData) => {
            const locationWithDefaults = {
              ...updatedLocation,
              id: updatedLocation.locationId ? updatedLocation.locationId : editingLocation.id,
              locationName: updatedLocation.locationName,
              name: updatedLocation.locationName,
              address: `${updatedLocation.addressLine1}, ${updatedLocation.city}, ${updatedLocation.state} ${updatedLocation.postalCode}`,
              phone: editingLocation.phone, // Keep existing phone
              isPrimary: updatedLocation.locationType === 'HOME_OFFICE_PRIMARY'
            };
            setLocations(prev => prev.map(loc => 
              loc.id === locationWithDefaults.id ? locationWithDefaults : loc
            ));
            setEditingLocation(null);
          }}
        />
      )}
    </div>
  );
};

export default LocationsList;
