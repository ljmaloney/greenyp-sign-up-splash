
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { ProducerProfile } from '@/types/profile';

interface HoursCardProps {
  profile: ProducerProfile;
}

const HoursCard = ({ profile }: HoursCardProps) => {
  const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayLabels = {
    'MONDAY': 'Monday',
    'TUESDAY': 'Tuesday', 
    'WEDNESDAY': 'Wednesday',
    'THURSDAY': 'Thursday',
    'FRIDAY': 'Friday',
    'SATURDAY': 'Saturday',
    'SUNDAY': 'Sunday'
  };

  const getHoursForDay = (day: string) => {
    const hours = profile.locationHours?.find(h => h.dayOfWeek === day);
    if (!hours || !hours.openTime || !hours.closeTime) {
      return '-';
    }
    return `${hours.openTime} - ${hours.closeTime}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
          <Clock className="w-5 h-5" />
          Hours of Operation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {daysOrder.map((day) => (
            <div key={day} className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{dayLabels[day as keyof typeof dayLabels]}:</span>
              <span className="text-gray-600">{getHoursForDay(day)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HoursCard;
