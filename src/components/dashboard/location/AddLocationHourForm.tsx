
import React, { useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { TimePicker } from "@/components/ui/time-picker.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
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
  dayOrder: string[];
}

const AddLocationHourForm = ({ hours, onAdd, formatDayName, dayOrder }: AddLocationHourFormProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHour, setNewHour] = useState({ dayOfWeek: '', openTime: '', closeTime: '' });

  const handleAddNew = () => {
    if (newHour.dayOfWeek && newHour.openTime && newHour.closeTime) {
      onAdd(newHour);
      setNewHour({ dayOfWeek: '', openTime: '', closeTime: '' });
      setIsAddingNew(false);
    }
  };

  const availableDays = dayOrder.filter(day => !hours.some(h => h.dayOfWeek === day));

  if (isAddingNew) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-4">Add New Operating Hours</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <Select 
                value={newHour.dayOfWeek} 
                onValueChange={(value) => setNewHour(prev => ({ ...prev, dayOfWeek: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {availableDays.map(day => (
                    <SelectItem key={day} value={day}>
                      {formatDayName(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 flex-wrap">
                <TimePicker
                  value={newHour.openTime}
                  onChange={(time) => setNewHour(prev => ({ ...prev, openTime: time }))}
                  placeholder="Open time"
                  className="flex-shrink-0"
                  defaultPeriod="AM"
                />
                <span className="text-gray-500 mx-2">to</span>
                <TimePicker
                  value={newHour.closeTime}
                  onChange={(time) => setNewHour(prev => ({ ...prev, closeTime: time }))}
                  placeholder="Close time"
                  className="flex-shrink-0"
                  defaultPeriod="PM"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleAddNew} className="bg-greenyp-600 hover:bg-greenyp-700">
              Add Hours
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAddingNew(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (availableDays.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>All days of the week have been configured.</p>
      </div>
    );
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={() => setIsAddingNew(true)}
      className="w-full bg-greenyp-50 hover:bg-greenyp-100 border-greenyp-200 text-greenyp-700"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Operating Hours
    </Button>
  );
};

export default AddLocationHourForm;
