
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";

interface Location {
  id: string;
  locationName: string;
}

interface ContactFormData {
  producerLocationId: string;
  producerContactType: "PRIMARY" | "ACCOUNTS_PAYABLE" | "ADMIN" | "DISABLED" | "SALES";
  displayContactType: "NO_DISPLAY" | "FULL_NAME_PHONE_EMAIL" | "GENERIC_NAME_PHONE_EMAIL" | "PHONE_EMAIL_ONLY";
  genericContactName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
}

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onContactAdded: (contact: ContactFormData) => void;
}

const AddContactDialog = ({ isOpen, onClose, locations, onContactAdded }: AddContactDialogProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    producerLocationId: '',
    producerContactType: 'PRIMARY',
    displayContactType: 'NO_DISPLAY',
    genericContactName: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    cellPhoneNumber: '',
    emailAddress: ''
  });
  
  const { toast } = useToast();

  const validateGenericContactName = (name: string): boolean => {
    return /^[A-Za-z\s&]*$/.test(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.producerLocationId) {
      toast({
        title: "Error",
        description: "Please select a location.",
        variant: "destructive",
      });
      return;
    }

    // Validate PRIMARY contact display type
    if (formData.producerContactType === 'PRIMARY') {
      if (!['PHONE_EMAIL_ONLY', 'FULL_NAME_PHONE_EMAIL', 'GENERIC_NAME_PHONE_EMAIL'].includes(formData.displayContactType)) {
        toast({
          title: "Error",
          description: "PRIMARY contact must have a display type of PHONE_EMAIL_ONLY, FULL_NAME_PHONE_EMAIL, or GENERIC_NAME_PHONE_EMAIL.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate Generic Contact Name for GENERIC_NAME_PHONE_EMAIL
    if (formData.displayContactType === 'GENERIC_NAME_PHONE_EMAIL') {
      if (!formData.genericContactName.trim()) {
        toast({
          title: "Error",
          description: "Generic Contact Name is required when Display Type is GENERIC_NAME_PHONE_EMAIL.",
          variant: "destructive",
        });
        return;
      }
      if (!validateGenericContactName(formData.genericContactName)) {
        toast({
          title: "Error",
          description: "Generic Contact Name must contain only A-Z, a-z, space, and & characters.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // For other display types, FirstName and LastName are required
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast({
          title: "Error",
          description: "First Name and Last Name are required.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      console.log('Adding contact:', formData);
      
      const response = await fetch(getApiUrl(`/producer/location/${formData.producerLocationId}/contact`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add contact: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Contact Added",
        description: "Contact has been successfully added.",
      });
      
      onContactAdded(formData);
      onClose();
      
      // Reset form
      setFormData({
        producerLocationId: '',
        producerContactType: 'PRIMARY',
        displayContactType: 'NO_DISPLAY',
        genericContactName: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        cellPhoneNumber: '',
        emailAddress: ''
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isGenericNameRequired = formData.displayContactType === 'GENERIC_NAME_PHONE_EMAIL';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
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
              <Select value={formData.producerContactType} onValueChange={(value: "PRIMARY" | "ACCOUNTS_PAYABLE" | "ADMIN" | "DISABLED" | "SALES") => handleChange('producerContactType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARY">Primary contact information for display</SelectItem>
                  <SelectItem value="ACCOUNTS_PAYABLE">Contact for accounts payable</SelectItem>
                  <SelectItem value="ADMIN">Primary administrative contact for the business, never displayed in search results</SelectItem>
                  <SelectItem value="DISABLED">Contact has been disabled</SelectItem>
                  <SelectItem value="SALES">Sales contact information for display</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Type
              </label>
              <Select value={formData.displayContactType} onValueChange={(value: "NO_DISPLAY" | "FULL_NAME_PHONE_EMAIL" | "GENERIC_NAME_PHONE_EMAIL" | "PHONE_EMAIL_ONLY") => handleChange('displayContactType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_DISPLAY">Do not display contact in search results</SelectItem>
                  <SelectItem value="FULL_NAME_PHONE_EMAIL">Display all details in search results</SelectItem>
                  <SelectItem value="GENERIC_NAME_PHONE_EMAIL">Display only generic name, phone, and email in search results</SelectItem>
                  <SelectItem value="PHONE_EMAIL_ONLY">Display only the phone and email in the search results</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generic Contact Name {isGenericNameRequired && '*'}
              </label>
              <Input
                value={formData.genericContactName}
                onChange={(e) => handleChange('genericContactName', e.target.value)}
                placeholder="e.g., Customer Service"
                required={isGenericNameRequired}
              />
              <p className="text-xs text-gray-500 mt-1">Only A-Z, a-z, space, and & characters allowed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name {!isGenericNameRequired && '*'}
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required={!isGenericNameRequired}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name {!isGenericNameRequired && '*'}
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required={!isGenericNameRequired}
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
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
