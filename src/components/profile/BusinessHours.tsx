
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface BusinessHoursProps {
  profile: ProfileData;
}

const BusinessHours = ({ profile }: BusinessHoursProps) => {
  const formatHours = () => {
    // Reorder to start with Monday after Sunday
    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayNames = {
      'SUNDAY': 'Sunday',
      'MONDAY': 'Monday', 
      'TUESDAY': 'Tuesday',
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday'
    };
    
    return dayOrder.map(day => {
      const hours = profile.locationHours.find(h => h.dayOfWeek === day);
      return {
        day: dayNames[day as keyof typeof dayNames],
        hours: hours && hours.openTime && hours.closeTime ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'
      };
    });
  };

  // Check if business hours are missing or empty
  const hasValidHours = profile.locationHours && profile.locationHours.length > 0 && 
    profile.locationHours.some(hour => hour.openTime && hour.closeTime);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-greenyp-600" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasValidHours ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formatHours().map((dayHours, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium text-gray-700">{dayHours.day}:</span>
                <span className="text-gray-600">{dayHours.hours}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No business hours provided, please contact the business via phone or email.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessHours;
