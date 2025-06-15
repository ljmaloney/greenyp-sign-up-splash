
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, Globe, Clock, Plus } from 'lucide-react';
import { Location } from '@/services/locationService';
import { Contact } from '@/services/contactService';
import LocationHoursSection from './LocationHoursSection';
import LocationContactsList from './LocationContactsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contact: Contact) => void;
}

const LocationCard = ({ location, onEdit, onEditContact, onDeleteContact }: LocationCardProps) => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);

  const formatAddress = (location: Location) => {
    const parts = [
      location.addressLine1,
      location.addressLine2,
      location.addressLine3,
      `${location.city}, ${location.state} ${location.postalCode}`
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const formatTime = (time: string) => {
    if (time === 'Closed' || !time) return 'Closed';
    return time;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl text-greenyp-600">{location.locationName}</CardTitle>
                <Badge variant={location.active ? 'default' : 'secondary'}>
                  {location.active ? 'Active' : 'Inactive'}
                </Badge>
                {location.locationType === 'HOME_OFFICE_PRIMARY' && (
                  <Badge variant="outline">Primary</Badge>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(location)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Address:</span>
                <span className="text-gray-900">{formatAddress(location)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Website:</span>
                {location.websiteUrl ? (
                  <a 
                    href={location.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-greenyp-600 hover:text-greenyp-700 underline"
                  >
                    {location.websiteUrl}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No website provided</span>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Type: </span>
                <span className="text-gray-900">
                  {location.locationType === 'HOME_OFFICE_PRIMARY' ? 'Primary Office' :
                   location.locationType === 'RETAIL_SALES_SERVICE' ? 'Retail Sales & Service' :
                   location.locationType === 'WHOLESALE_SALES' ? 'Wholesale' :
                   location.locationType}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Display: </span>
                <span className="text-gray-900">
                  {location.locationDisplayType === 'NO_DISPLAY' ? 'Hidden from search' :
                   location.locationDisplayType === 'CITY_STATE_ZIP' ? 'City, State, ZIP only' :
                   location.locationDisplayType === 'FULL_ADDRESS' ? 'Full address' :
                   location.locationDisplayType}
                </span>
              </div>
            </div>
          </div>

          {/* Hours of Operation Section */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-greenyp-600" />
                <h3 className="text-lg font-semibold text-gray-900">Hours of Operation</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsHoursDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Manage Hours
              </Button>
            </div>

            {!location.locationHours || location.locationHours.length === 0 ? (
              <p className="text-gray-600">No hours of operation set for this location.</p>
            ) : (
              <div className="space-y-2">
                {location.locationHours.map((hour) => (
                  <div key={hour.dayOfWeek} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{formatDayName(hour.dayOfWeek)}</span>
                    <span className="text-gray-600">
                      {hour.closed ? 'Closed' : `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts Section */}
          {producerId && (
            <LocationContactsList 
              producerId={producerId}
              locationId={location.locationId}
              onEditContact={onEditContact}
              onDeleteContact={onDeleteContact}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Hours of Operation - {location.locationName}</DialogTitle>
          </DialogHeader>
          <LocationHoursSection locationId={location.locationId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationCard;
