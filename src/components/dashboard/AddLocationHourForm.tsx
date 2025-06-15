
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface LocationHour {
  locationHoursId?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

interface AddLocationHourFormProps {
  hours: LocationHour[];
  onAdd: (hourData: LocationHour) => void;
  formatDayName: (day: string) => string;
}

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 
  'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const AddLocationHourForm = ({ hours, onAdd, formatDayName }: AddLocationHourFormProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHour, setNewHour] = useState({ dayOfWeek: '', openTime: '', closeTime: '' });

  const handleAddNew = () => {
    if (newHour.dayOfWeek && newHour.openTime && newHour.closeTime) {
      onAdd(newHour);
      setNewHour({ dayOfWeek: '', openTime: '', closeTime: '' });
      setIsAddingNew(false);
    }
  };

  if (isAddingNew) {
    return (
      <div className="flex items-center space-x-2 py-2 border-t pt-2">
        <Select 
          value={newHour.dayOfWeek} 
          onValueChange={(value) => setNewHour(prev => ({ ...prev, dayOfWeek: value }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.filter(day => !hours.some(h => h.dayOfWeek === day)).map(day => (
              <SelectItem key={day} value={day}>
                {formatDayName(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TimePicker
          value={newHour.openTime}
          onChange={(time) => setNewHour(prev => ({ ...prev, openTime: time }))}
          placeholder="Open time"
        />
        <span className="text-gray-500">-</span>
        <TimePicker
          value={newHour.closeTime}
          onChange={(time) => setNewHour(prev => ({ ...prev, closeTime: time }))}
          placeholder="Close time"
        />
        <Button size="sm" onClick={handleAddNew} className="bg-greenyp-600 hover:bg-greenyp-700">
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsAddingNew(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={() => setIsAddingNew(true)}
      className="mt-2"
    >
      <Plus className="w-4 h-4 mr-1" />
      Add Hours
    </Button>
  );
};

export default AddLocationHourForm;
