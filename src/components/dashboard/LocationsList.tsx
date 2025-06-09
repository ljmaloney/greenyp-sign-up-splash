
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Plus, Edit, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
  const [showInactiveLocations, setShowInactiveLocations] = useState(false);
  const { toast } = useToast();
  
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

  // Update primary location logic when locations change
  useEffect(() => {
    setLocations(prevLocations => {
      const activeLocations = prevLocations.filter(loc => loc.active);
      
      // If there's only one active location, it must be primary
      if (activeLocations.length === 1) {
        return prevLocations.map(loc => ({
          ...loc,
          isPrimary: loc.active,
          locationType: loc.active ? 'HOME_OFFICE_PRIMARY' : loc.locationType
        }));
      }
      
      // If there are multiple active locations, ensure exactly one is primary
      const primaryLocations = activeLocations.filter(loc => loc.isPrimary);
      if (primaryLocations.length === 0 && activeLocations.length > 0) {
        // Make the first active location primary if none exists
        const firstActiveId = activeLocations[0].id;
        return prevLocations.map(loc => ({
          ...loc,
          isPrimary: loc.id === firstActiveId && loc.active,
          locationType: loc.id === firstActiveId && loc.active ? 'HOME_OFFICE_PRIMARY' : 
                       (loc.locationType === 'HOME_OFFICE_PRIMARY' ? 'OFFICE' : loc.locationType)
        }));
      }
      
      return prevLocations;
    });
  }, []);

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

  const toggleLocationStatus = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    
    // Prevent deactivating the primary location
    if (location?.isPrimary && location.active) {
      toast({
        title: "Cannot Deactivate Primary Location",
        description: "The primary location cannot be made inactive. Please set another location as primary first.",
        variant: "destructive",
      });
      return;
    }

    // Check if this would be the last active location
    const activeLocations = locations.filter(loc => loc.active);
    if (activeLocations.length === 1 && location?.active) {
      toast({
        title: "Cannot Deactivate Last Location",
        description: "You must have at least one active location.",
        variant: "destructive",
      });
      return;
    }

    setLocations(prev => {
      const updated = prev.map(loc => 
        loc.id === locationId ? { ...loc, active: !loc.active } : loc
      );
      
      // If we're deactivating a primary location, make another active location primary
      const deactivatedLocation = updated.find(loc => loc.id === locationId);
      if (deactivatedLocation && !deactivatedLocation.active && deactivatedLocation.isPrimary) {
        const otherActiveLocation = updated.find(loc => loc.active && loc.id !== locationId);
        if (otherActiveLocation) {
          return updated.map(loc => {
            if (loc.id === locationId) {
              return { ...loc, isPrimary: false, locationType: loc.locationType === 'HOME_OFFICE_PRIMARY' ? 'OFFICE' : loc.locationType };
            }
            if (loc.id === otherActiveLocation.id) {
              return { ...loc, isPrimary: true, locationType: 'HOME_OFFICE_PRIMARY' };
            }
            return loc;
          });
        }
      }
      
      return updated;
    });
  };

  // Filter locations based on active status
  const filteredLocations = showInactiveLocations 
    ? locations 
    : locations.filter(location => location.active);

  const hasMultipleLocations = filteredLocations.length > 1;
  const inactiveLocationCount = locations.filter(loc => !loc.active).length;

  // Check if a location can be deactivated
  const canDeactivateLocation = (location: Location) => {
    if (!location.active) return false; // Already inactive
    if (location.isPrimary) return false; // Primary locations cannot be deactivated
    
    const activeLocations = locations.filter(loc => loc.active);
    return activeLocations.length > 1; // Must have at least one active location
  };

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

      {/* Filter Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">
            Show inactive locations
          </span>
          <Switch
            checked={showInactiveLocations}
            onCheckedChange={setShowInactiveLocations}
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredLocations.length} of {locations.length} locations
          {inactiveLocationCount > 0 && !showInactiveLocations && (
            <span className="ml-2 text-gray-500">
              ({inactiveLocationCount} inactive)
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className={!location.active ? 'opacity-60 border-gray-300' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
                  <div className="flex items-center space-x-3 flex-1">
                    <span className={!location.active ? 'text-gray-500' : ''}>{location.locationName}</span>
                    {location.websiteUrl && (
                      <span className="text-sm text-gray-500">{location.websiteUrl}</span>
                    )}
                    {location.isPrimary && (
                      <span className="ml-2 px-2 py-1 bg-greenyp-100 text-greenyp-700 text-xs rounded-full">
                        Primary
                      </span>
                    )}
                    {!location.active && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Active</span>
                    <Switch
                      checked={location.active}
                      onCheckedChange={() => toggleLocationStatus(location.id)}
                      disabled={!canDeactivateLocation(location)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingLocation(location)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className={`text-gray-600 ${!location.active ? 'text-gray-500' : ''}`}>
                      {getFullAddress(location)}
                    </p>
                    {location.phone && (
                      <span className={`text-gray-600 ${!location.active ? 'text-gray-500' : ''}`}>
                        • {location.phone}
                      </span>
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
          const isFirstLocation = locations.length === 0;
          const locationWithDefaults = {
            ...newLocation,
            id: Date.now().toString(),
            locationName: newLocation.locationName,
            name: newLocation.locationName,
            address: `${newLocation.addressLine1}, ${newLocation.city}, ${newLocation.state} ${newLocation.postalCode}`,
            phone: '(555) 123-4567', // Default phone for now
            isPrimary: isFirstLocation || newLocation.locationType === 'HOME_OFFICE_PRIMARY',
            locationType: isFirstLocation ? 'HOME_OFFICE_PRIMARY' : newLocation.locationType
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
