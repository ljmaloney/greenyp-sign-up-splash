
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { LocationHours } from '@/types/profile';

interface ProfileHoursProps {
  hours: LocationHours[];
}

const ProfileHours = ({ hours }: ProfileHoursProps) => {
  const daysOrder = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 
    'THURSDAY', 'FRIDAY', 'SATURDAY'
  ];

  const formatTime = (time: string) => {
    if (!time) return 'Closed';
    // Convert 24-hour format to 12-hour format
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour);
    const ampm = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt === 0 ? 12 : hourInt > 12 ? hourInt - 12 : hourInt;
    return `${hour12}:${minute} ${ampm}`;
  };

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  // Sort hours by day of week
  const sortedHours = hours.sort((a, b) => {
    return daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHours.length > 0 ? (
          <div className="space-y-2">
            {sortedHours.map((hour) => (
              <div key={hour.locationHoursId} className="flex justify-between">
                <span className="font-medium text-gray-900">
                  {formatDayName(hour.dayOfWeek)}
                </span>
                <span className="text-gray-600">
                  {hour.openTime && hour.closeTime 
                    ? `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`
                    : 'Closed'
                  }
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Hours not available
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHours;
