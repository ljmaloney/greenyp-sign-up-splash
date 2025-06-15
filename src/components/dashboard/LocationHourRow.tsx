
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from 'lucide-react';

interface LocationHour {
  locationHoursId?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

interface LocationHourRowProps {
  hour: LocationHour;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (dayOfWeek: string, openTime: string, closeTime: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  formatDayName: (day: string) => string;
}

const LocationHourRow = ({ 
  hour, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete, 
  onCancel, 
  formatDayName 
}: LocationHourRowProps) => {
  const [openTime, setOpenTime] = useState(hour.openTime);
  const [closeTime, setCloseTime] = useState(hour.closeTime);

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2 py-2 border-b border-gray-100">
        <span className="font-medium w-20">{formatDayName(hour.dayOfWeek)}</span>
        <Input
          className="w-24"
          value={openTime}
          onChange={(e) => setOpenTime(e.target.value)}
        />
        <span className="text-gray-500">-</span>
        <Input
          className="w-24"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
        />
        <Button 
          size="sm" 
          onClick={() => onSave(hour.dayOfWeek, openTime, closeTime)} 
          className="bg-greenyp-600 hover:bg-greenyp-700"
        >
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-4">
        <span className="font-medium w-20">{formatDayName(hour.dayOfWeek)}</span>
        <span className="text-gray-600">{hour.openTime} - {hour.closeTime}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          <Edit className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600 hover:text-red-700">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default LocationHourRow;
