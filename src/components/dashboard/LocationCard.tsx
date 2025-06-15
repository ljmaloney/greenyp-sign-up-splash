
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, Globe, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

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

  const getSortedHours = () => {
    if (!location.locationHours) return [];
    
    // Day order starting with Sunday
    const dayOrder = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    
    return location.locationHours.sort((a, b) => {
      const aIndex = dayOrder.indexOf(a.dayOfWeek);
      const bIndex = dayOrder.indexOf(b.dayOfWeek);
      return aIndex - bIndex;
    });
  };

  const hasHours = location.locationHours && location.locationHours.length > 0;
  const sortedHours = getSortedHours();

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
            <div className="bg-gray-50 rounded-lg border">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsHoursExpanded(!isHoursExpanded)}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-greenyp-600" />
                  <h3 className="text-lg font-medium text-gray-900">Hours of Operation</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsHoursDialogOpen(true);
                    }}
                    className="bg-greenyp-600 hover:bg-greenyp-700 text-white border-greenyp-600 hover:border-greenyp-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                  {hasHours ? (
                    isHoursExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )
                  ) : null}
                </div>
              </div>

              {isHoursExpanded && hasHours && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="space-y-2 pt-4">
                    {sortedHours.map((hour) => (
                      <div key={hour.dayOfWeek} className="flex justify-between items-center py-1">
                        <span className="font-medium text-gray-700">{formatDayName(hour.dayOfWeek)}</span>
                        <span className="text-gray-600">
                          {hour.closed ? 'Closed' : `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!hasHours && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm">No hours of operation set for this location.</p>
                </div>
              )}
            </div>
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-greenyp-600 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Manage Hours of Operation
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Set the operating hours for <span className="font-medium">{location.locationName}</span>
            </p>
          </DialogHeader>
          <div className="py-4">
            <LocationHoursSection locationId={location.locationId} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationCard;
