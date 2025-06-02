import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  locationId?: string;
  producerLocationId?: string;
  producerContactType?: "PRIMARY" | "SECONDARY";
  displayContactType?: "NO_DISPLAY" | "DISPLAY_WITH_MAP" | "DISPLAY_ONLY";
  genericContactName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  cellPhoneNumber?: string;
  emailAddress?: string;
}

interface Location {
  id: string;
  locationName: string;
}

interface ContactFormData {
  producerLocationId: string;
  producerContactType: "PRIMARY" | "SECONDARY";
  displayContactType: "NO_DISPLAY" | "DISPLAY_WITH_MAP" | "DISPLAY_ONLY";
  genericContactName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
}

interface EditContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  locations: Location[];
  onContactUpdated: (contact: ContactFormData) => void;
}

const EditContactDialog = ({ isOpen, onClose, contact, locations, onContactUpdated }: EditContactDialogProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    producerLocationId: contact.producerLocationId || contact.locationId || '',
    producerContactType: contact.producerContactType || (contact.isPrimary ? 'PRIMARY' : 'SECONDARY'),
    displayContactType: contact.displayContactType || 'NO_DISPLAY',
    genericContactName: contact.genericContactName || '',
    firstName: contact.firstName || contact.name.split(' ')[0] || '',
    lastName: contact.lastName || contact.name.split(' ').slice(1).join(' ') || '',
    phoneNumber: contact.phoneNumber || contact.phone || '',
    cellPhoneNumber: contact.cellPhoneNumber || '',
    emailAddress: contact.emailAddress || contact.email || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.producerLocationId) {
      toast({
        title: "Location Required",
        description: "Please select a location for this contact.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Updating contact:', formData);
      
      const response = await fetch(getApiUrl('/producer/contact'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          contactId: contact.id
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Contact Updated",
        description: "Contact has been successfully updated.",
      });
      
      onContactUpdated(formData);
      onClose();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <Select value={formData.producerLocationId} onValueChange={(value) => handleChange('producerLocationId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.locationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Type
              </label>
              <Select value={formData.producerContactType} onValueChange={(value: "PRIMARY" | "SECONDARY") => handleChange('producerContactType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARY">Primary</SelectItem>
                  <SelectItem value="SECONDARY">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Type
              </label>
              <Select value={formData.displayContactType} onValueChange={(value: "NO_DISPLAY" | "DISPLAY_WITH_MAP" | "DISPLAY_ONLY") => handleChange('displayContactType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_DISPLAY">No Display</SelectItem>
                  <SelectItem value="DISPLAY_WITH_MAP">Display with Map</SelectItem>
                  <SelectItem value="DISPLAY_ONLY">Display Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generic Contact Name
              </label>
              <Input
                value={formData.genericContactName}
                onChange={(e) => handleChange('genericContactName', e.target.value)}
                placeholder="e.g., Customer Service"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cell Phone Number
              </label>
              <Input
                value={formData.cellPhoneNumber}
                onChange={(e) => handleChange('cellPhoneNumber', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleChange('emailAddress', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
              Update Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
