
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateContactInformation } from '@/services/businessProfileService';

interface ContactInfoData {
  email: string;
  phone: string;
  address: string;
  website: string;
  producerId?: string;
  lineOfBusinessId?: string;
  subscriptionId?: string;
  businessName?: string;
  description?: string;
  contactId?: string;
  producerLocationId?: string;
  firstName?: string;
  lastName?: string;
  cellPhone?: string;
}

interface EditContactInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contactData: ContactInfoData;
}

const EditContactInfoDialog = ({ isOpen, onClose, contactData }: EditContactInfoDialogProps) => {
  const [formData, setFormData] = useState(contactData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare the API request payload
      const updateRequest = {
        producerId: formData.producerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Mock ID for now
        producerRequest: {
          producerId: formData.producerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          businessName: formData.businessName || "Green Landscaping Pro",
          lineOfBusinessId: formData.lineOfBusinessId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          subscriptionId: formData.subscriptionId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          subscriptionType: "ADMIN",
          invoiceCycleType: "MONTHLY",
          websiteUrl: formData.website,
          narrative: formData.description || "Professional landscaping services"
        },
        primaryContact: {
          contactId: formData.contactId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          producerLocationId: formData.producerLocationId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          producerContactType: "PRIMARY",
          displayContactType: "NO_DISPLAY",
          genericContactName: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          phoneNumber: formData.phone,
          cellPhoneNumber: formData.cellPhone || "",
          emailAddress: formData.email
        }
      };

      console.log('Updating contact information:', updateRequest);
      await updateContactInformation(updateRequest);
      
      toast({
        title: "Contact Information Updated",
        description: "Your contact information has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating contact information:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update contact information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ContactInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Contact Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="www.example.com"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactInfoDialog;
