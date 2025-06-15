
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { useLocations } from "@/hooks/useLocations";
import { useSearchParams } from 'react-router-dom';

interface LocationHour {
  locationHoursId?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

interface LocationHoursSectionProps {
  locationId: string;
}

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 
  'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const LocationHoursSection = ({ locationId }: LocationHoursSectionProps) => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  const { data: locations, refetch: refetchLocations } = useLocations(producerId);
  
  const [hours, setHours] = useState<LocationHour[]>([]);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHour, setNewHour] = useState({ dayOfWeek: '', openTime: '', closeTime: '' });
  
  const { toast } = useToast();

  // Load existing hours from the location data
  useEffect(() => {
    if (locations) {
      const location = locations.find(loc => loc.locationId === locationId);
      if (location?.locationHours) {
        setHours(location.locationHours.map(hour => ({
          locationHoursId: hour.locationHoursId,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime
        })));
      }
    }
  }, [locations, locationId]);

  const saveHours = async (hourData: LocationHour, isUpdate: boolean = false) => {
    try {
      const payload = {
        locationId,
        dayOfWeek: hourData.dayOfWeek,
        openTime: hourData.openTime,
        closeTime: hourData.closeTime
      };
      
      console.log(`${isUpdate ? 'Updating' : 'Adding'} location hours:`, payload);
      
      const response = await fetch(getApiUrl('/producer/location/hours'), {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'add'} location hours: ${response.status}`);
      }

      toast({
        title: "Hours Updated",
        description: `Location hours have been successfully ${isUpdate ? 'updated' : 'added'}.`,
      });

      // Refresh the locations data to get the updated hours
      await refetchLocations();
    } catch (error) {
      console.error('Error saving location hours:', error);
      toast({
        title: "Error",
        description: `Failed to ${isUpdate ? 'update' : 'add'} location hours. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const deleteHours = async (locationHoursId: string, dayOfWeek: string) => {
    try {
      console.log('Deleting location hours for:', dayOfWeek, 'with ID:', locationHoursId);
      
      const response = await fetch(getApiUrl(`/producer/location/hours/${locationHoursId}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete location hours: ${response.status}`);
      }

      setHours(prev => prev.filter(h => h.dayOfWeek !== dayOfWeek));
      
      toast({
        title: "Hours Deleted",
        description: "Location hours have been successfully deleted.",
      });

      // Refresh the locations data
      await refetchLocations();
    } catch (error) {
      console.error('Error deleting location hours:', error);
      toast({
        title: "Error",
        description: "Failed to delete location hours. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (dayOfWeek: string) => {
    setEditingDay(dayOfWeek);
  };

  const handleSave = (dayOfWeek: string, openTime: string, closeTime: string) => {
    const updatedHours = hours.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, openTime, closeTime } : h
    );
    setHours(updatedHours);
    
    const hourData = { dayOfWeek, openTime, closeTime };
    saveHours(hourData, true);
    setEditingDay(null);
  };

  const handleAddNew = () => {
    if (newHour.dayOfWeek && newHour.openTime && newHour.closeTime) {
      setHours(prev => [...prev, newHour]);
      saveHours(newHour, false);
      setNewHour({ dayOfWeek: '', openTime: '', closeTime: '' });
      setIsAddingNew(false);
    }
  };

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-2">
      {hours.map((hour) => (
        <HourRow
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
      
      {isAddingNew ? (
        <div className="flex items-center space-x-2 py-2 border-t pt-2">
          <Select value={newHour.dayOfWeek} onValueChange={(value) => setNewHour(prev => ({ ...prev, dayOfWeek: value }))}>
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
          <Input
            className="w-24"
            placeholder="Open"
            value={newHour.openTime}
            onChange={(e) => setNewHour(prev => ({ ...prev, openTime: e.target.value }))}
          />
          <span className="text-gray-500">-</span>
          <Input
            className="w-24"
            placeholder="Close"
            value={newHour.closeTime}
            onChange={(e) => setNewHour(prev => ({ ...prev, closeTime: e.target.value }))}
          />
          <Button size="sm" onClick={handleAddNew} className="bg-greenyp-600 hover:bg-greenyp-700">
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsAddingNew(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAddingNew(true)}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Hours
        </Button>
      )}
    </div>
  );
};

interface HourRowProps {
  hour: LocationHour;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (dayOfWeek: string, openTime: string, closeTime: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  formatDayName: (day: string) => string;
}

const HourRow = ({ hour, isEditing, onEdit, onSave, onDelete, onCancel, formatDayName }: HourRowProps) => {
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
        <Button size="sm" onClick={() => onSave(hour.dayOfWeek, openTime, closeTime)} className="bg-greenyp-600 hover:bg-greenyp-700">
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

export default LocationHoursSection;
