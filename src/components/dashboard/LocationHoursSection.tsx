
import React, { useState } from 'react';
import { useLocationHours } from '@/hooks/useLocationHours';
import LocationHourRow from './LocationHourRow';
import AddLocationHourForm from './AddLocationHourForm';
import { Clock } from 'lucide-react';

interface LocationHoursSectionProps {
  locationId: string;
}

const LocationHoursSection = ({ locationId }: LocationHoursSectionProps) => {
  const { hours, deleteHours, updateHours, addNewHours } = useLocationHours(locationId);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  const handleEdit = (dayOfWeek: string) => {
    setEditingDay(dayOfWeek);
  };

  const handleSave = (dayOfWeek: string, openTime: string, closeTime: string) => {
    updateHours(dayOfWeek, openTime, closeTime);
    setEditingDay(null);
  };

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-4">
      {hours.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hours Set</h3>
          <p className="text-gray-600 mb-4">Add operating hours for this location to help customers know when you're open.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h4 className="font-medium text-gray-900">Current Operating Hours</h4>
            <p className="text-sm text-gray-600 mt-1">Click edit to modify or delete to remove hours for any day</p>
          </div>
          <div className="divide-y">
            {hours.map((hour) => (
              <div key={hour.dayOfWeek} className="px-4">
                <LocationHourRow
                  hour={hour}
                  isEditing={editingDay === hour.dayOfWeek}
                  onEdit={() => handleEdit(hour.dayOfWeek)}
                  onSave={handleSave}
                  onDelete={() => hour.locationHoursId && deleteHours(hour.locationHoursId, hour.dayOfWeek)}
                  onCancel={() => setEditingDay(null)}
                  formatDayName={formatDayName}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <AddLocationHourForm
          hours={hours}
          onAdd={addNewHours}
          formatDayName={formatDayName}
        />
      </div>
    </div>
  );
};

export default LocationHoursSection;
