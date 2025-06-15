
import React, { useState } from 'react';
import { useLocationHours } from '@/hooks/useLocationHours';
import LocationHourRow from './LocationHourRow';
import AddLocationHourForm from './AddLocationHourForm';

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
    <div className="space-y-2">
      {hours.map((hour) => (
        <LocationHourRow
          key={hour.dayOfWeek}
          hour={hour}
          isEditing={editingDay === hour.dayOfWeek}
          onEdit={() => handleEdit(hour.dayOfWeek)}
          onSave={handleSave}
          onDelete={() => hour.locationHoursId && deleteHours(hour.locationHoursId, hour.dayOfWeek)}
          onCancel={() => setEditingDay(null)}
          formatDayName={formatDayName}
        />
      ))}
      
      <AddLocationHourForm
        hours={hours}
        onAdd={addNewHours}
        formatDayName={formatDayName}
      />
    </div>
  );
};

export default LocationHoursSection;
