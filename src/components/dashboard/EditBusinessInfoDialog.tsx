
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLineOfBusiness } from "@/hooks/useLineOfBusiness";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { updateBusinessInformation } from '@/services/businessProfileService';

interface BusinessInfoData {
  businessName: string;
  description: string;
  websiteUrl?: string;
  producerId?: string;
  lineOfBusinessId?: string;
  subscriptionId?: string;
}

interface EditBusinessInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: BusinessInfoData;
}

const EditBusinessInfoDialog = ({ isOpen, onClose, businessData }: EditBusinessInfoDialogProps) => {
  const [formData, setFormData] = useState(businessData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: lineOfBusinessData } = useLineOfBusiness();
  const { data: subscriptions } = useSubscriptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare the API request payload
      const updateRequest = {
        producerId: formData.producerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Mock ID for now
        producerRequest: {
          producerId: formData.producerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          businessName: formData.businessName,
          lineOfBusinessId: formData.lineOfBusinessId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          subscriptionId: formData.subscriptionId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          subscriptionType: "ADMIN",
          invoiceCycleType: "MONTHLY",
          websiteUrl: formData.websiteUrl || "",
          narrative: formData.description
        }
      };

      console.log('Updating business information:', updateRequest);
      await updateBusinessInformation(updateRequest);
      
      toast({
        title: "Business Information Updated",
        description: "Your business information has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating business information:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update business information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof BusinessInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get current line of business display name
  const getCurrentLineOfBusinessName = () => {
    if (!lineOfBusinessData || !formData.lineOfBusinessId) return '';
    const lob = lineOfBusinessData.find(l => l.lineOfBusinessId === formData.lineOfBusinessId);
    return lob?.lineOfBusinessName || '';
  };

  // Get current subscription display name
  const getCurrentSubscriptionName = () => {
    if (!subscriptions || !formData.subscriptionId) return '';
    const subscription = subscriptions.find(s => s.subscriptionId === formData.subscriptionId);
    return subscription?.displayName || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Business Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <Input
                value={formData.websiteUrl || ''}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line of Business
              </label>
              <Select 
                value={formData.lineOfBusinessId || ''} 
                onValueChange={(value) => handleChange('lineOfBusinessId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select line of business">
                    {getCurrentLineOfBusinessName()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {lineOfBusinessData?.map((lob) => (
                    <SelectItem key={lob.lineOfBusinessId} value={lob.lineOfBusinessId}>
                      {lob.lineOfBusinessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Plan
              </label>
              <Select 
                value={formData.subscriptionId || ''} 
                onValueChange={(value) => handleChange('subscriptionId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription plan">
                    {getCurrentSubscriptionName()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subscriptions?.filter(sub => !sub.comingSoon).map((subscription) => (
                    <SelectItem key={subscription.subscriptionId} value={subscription.subscriptionId}>
                      {subscription.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenyp-600"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
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

export default EditBusinessInfoDialog;
