
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import type { LocationHours } from '@/types/profile';

interface ProfileBusinessHoursProps {
  locationHours: LocationHours[];
}

const ProfileBusinessHours = ({ locationHours }: ProfileBusinessHoursProps) => {
  if (!locationHours || locationHours.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {locationHours.map((hour, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="font-medium capitalize text-gray-700">
                {hour.dayOfWeek.toLowerCase()}
              </span>
              <span className="text-gray-600">
                {hour.openTime} - {hour.closeTime}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBusinessHours;
