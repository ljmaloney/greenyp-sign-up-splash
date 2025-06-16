
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from '@/config/api';
import { useQueryClient } from '@tanstack/react-query';
import { PrimaryLocation, Producer } from '@/services/accountService';

interface EditPrimaryLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  primaryLocation: PrimaryLocation;
  producer: Producer;
}

const US_STATES_AND_TERRITORIES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'American Samoa', 'District of Columbia', 'Guam', 'Northern Mariana Islands', 'Puerto Rico',
  'U.S. Virgin Islands'
];

const EditPrimaryLocationDialog = ({ isOpen, onClose, primaryLocation, producer }: EditPrimaryLocationDialogProps) => {
  const [formData, setFormData] = useState({
    locationName: primaryLocation.locationName,
    locationDisplayType: primaryLocation.locationDisplayType,
    addressLine1: primaryLocation.addressLine1,
    addressLine2: primaryLocation.addressLine2 || '',
    city: primaryLocation.city,
    state: primaryLocation.state,
    postalCode: primaryLocation.postalCode,
    latitude: primaryLocation.latitude,
    longitude: primaryLocation.longitude,
    websiteUrl: primaryLocation.websiteUrl || producer.websiteUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        locationId: primaryLocation.locationId,
        locationName: formData.locationName,
        locationType: primaryLocation.locationType, // Not editable
        locationDisplayType: formData.locationDisplayType,
        active: primaryLocation.active,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        websiteUrl: formData.websiteUrl || producer.websiteUrl || ''
      };

      console.log('🚀 Updating primary location with payload:', payload);
      
      const response = await fetch(getApiUrl('/account/producer'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update primary location: ${response.status}`);
      }

      // Invalidate and refetch account data
      queryClient.invalidateQueries({ queryKey: ['accountData'] });
      
      toast({
        title: "Primary Location Updated",
        description: "Your primary location has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error updating primary location:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update primary location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Primary Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name *
            </label>
            <Input
              value={formData.locationName}
              onChange={(e) => handleChange('locationName', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Type
            </label>
            <Select value={formData.locationDisplayType} onValueChange={(value) => handleChange('locationDisplayType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NO_DISPLAY">Do not display this location in the search results</SelectItem>
                <SelectItem value="CITY_STATE_ZIP">Display only the city, state, and zip code in search results</SelectItem>
                <SelectItem value="FULL_ADDRESS">Display the full address in the search results</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <Input
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <Input
                value={formData.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <Input
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES_AND_TERRITORIES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <Input
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                pattern="^\d{5}(-\d{4})?$"
                placeholder="12345 or 12345-6789"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <Input
                value={formData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordinates
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="Latitude (37.7749)"
                  />
                </div>
                <div>
                  <Input
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="Longitude (-122.4194)"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-greenyp-600 hover:bg-greenyp-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrimaryLocationDialog;
