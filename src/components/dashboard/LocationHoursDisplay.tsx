
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import { LocationHour } from '@/services/locationService';
import LocationHoursSection from './LocationHoursSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LocationHoursDisplayProps {
  locationId: string;
  locationHours: LocationHour[] | null;
  locationName: string;
}

const LocationHoursDisplay = ({ locationId, locationHours, locationName }: LocationHoursDisplayProps) => {
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const formatTime = (time: string) => {
    if (time === 'Closed' || !time) return 'Closed';
    return time;
  };

  if (!locationHours || locationHours.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-greenyp-600" />
                Hours of Operation
              </div>
              <Button
                size="sm"
                onClick={() => setIsHoursDialogOpen(true)}
                className="bg-greenyp-600 hover:bg-greenyp-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Hours
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No hours of operation set for this location.</p>
          </CardContent>
        </Card>

        <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Hours of Operation - {locationName}</DialogTitle>
            </DialogHeader>
            <LocationHoursSection locationId={locationId} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-greenyp-600" />
              Hours of Operation
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsHoursDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Manage Hours
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {locationHours.map((hour) => (
              <div key={hour.dayOfWeek} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700">{formatDayName(hour.dayOfWeek)}</span>
                <span className="text-gray-600">
                  {hour.closed ? 'Closed' : `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Hours of Operation - {locationName}</DialogTitle>
          </DialogHeader>
          <LocationHoursSection locationId={locationId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationHoursDisplay;
