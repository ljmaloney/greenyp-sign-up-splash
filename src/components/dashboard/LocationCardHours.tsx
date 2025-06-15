
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Location } from '@/services/locationService';
import LocationHoursSection from './LocationHoursSection';

interface LocationCardHoursProps {
  location: Location;
}

const LocationCardHours = ({ location }: LocationCardHoursProps) => {
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);

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

export default LocationCardHours;
