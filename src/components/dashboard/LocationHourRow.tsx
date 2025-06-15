
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
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
      <div className="py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="min-w-[100px]">
            <span className="font-medium text-gray-900">{formatDayName(hour.dayOfWeek)}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TimePicker
              value={openTime}
              onChange={setOpenTime}
              placeholder="Open time"
              className="flex-shrink-0"
              defaultPeriod="AM"
            />
            <span className="text-gray-500 mx-2">to</span>
            <TimePicker
              value={closeTime}
              onChange={setCloseTime}
              placeholder="Close time"
              className="flex-shrink-0"
              defaultPeriod="PM"
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
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
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="min-w-[100px]">
            <span className="font-medium text-gray-900">{formatDayName(hour.dayOfWeek)}</span>
          </div>
          <span className="text-gray-600">{hour.openTime} - {hour.closeTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onEdit}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onDelete} 
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationHourRow;
