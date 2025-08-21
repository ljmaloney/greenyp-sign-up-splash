
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useLocations } from "@/hooks/useLocations";
import { apiClient } from "@/utils/apiClient";

interface LocationHour {
  locationHoursId?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

export const useLocationHours = (locationId: string) => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  const { data: locations, refetch: refetchLocations } = useLocations(producerId);
  
  const [hours, setHours] = useState<LocationHour[]>([]);
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
      
      const response = await apiClient.request('/producer/location/hours', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        requireAuth: true
      });

      if (!response.success) {
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
      
      const response = await apiClient.request(`/producer/location/hours/${locationHoursId}`, {
        method: 'DELETE',
        requireAuth: true
      });

      if (!response.success) {
        throw new Error(`Failed to delete hours for ${dayOfWeek}: ${response.status}`);
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

  const updateHours = (dayOfWeek: string, openTime: string, closeTime: string) => {
    const updatedHours = hours.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, openTime, closeTime } : h
    );
    setHours(updatedHours);
    
    const hourData = { dayOfWeek, openTime, closeTime };
    saveHours(hourData, true);
  };

  const addNewHours = (hourData: LocationHour) => {
    setHours(prev => [...prev, hourData]);
    saveHours(hourData, false);
  };

  return {
    hours,
    saveHours,
    deleteHours,
    updateHours,
    addNewHours
  };
};
