
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { updateBusinessInformation } from '@/services/businessProfileService';
import { useQueryClient } from '@tanstack/react-query';

interface BusinessData {
  businessName: string;
  description: string;
  websiteUrl: string;
  producerId: string;
  lineOfBusinessId: string;
}

interface EditBusinessInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: BusinessData;
}

const EditBusinessInfoDialog = ({ isOpen, onClose, businessData }: EditBusinessInfoDialogProps) => {
  const [formData, setFormData] = useState({
    businessName: businessData.businessName,
    lineOfBusinessId: businessData.lineOfBusinessId,
    websiteUrl: businessData.websiteUrl || '',
    narrative: businessData.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { data: lineOfBusinessData } = useLineOfBusiness();
  const { data: subscriptions } = useSubscriptions();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the current subscription (assuming TOP_LEVEL subscription)
      const currentSubscriptionId = subscriptions?.find(sub => !sub.comingSoon)?.subscriptionId || '';
      
      const payload = {
        producerId: businessData.producerId,
        producerRequest: {
          producerId: businessData.producerId,
          businessName: formData.businessName,
          lineOfBusinessId: formData.lineOfBusinessId,
          subscriptionId: currentSubscriptionId,
          subscriptionType: "ADMIN",
          invoiceCycleType: "MONTHLY",
          websiteUrl: formData.websiteUrl,
          narrative: formData.narrative,
        }
      };

      console.log('🚀 Updating business information with payload:', payload);
      
      await updateBusinessInformation(payload);
      
      // Invalidate and refetch account data
      queryClient.invalidateQueries({ queryKey: ['accountData'] });
      
      toast({
        title: "Business Profile Updated",
        description: "Your business information has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error updating business information:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update business information. Please try again.",
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
          <DialogTitle>Edit Business Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line of Business *
              </label>
              <Select 
                value={formData.lineOfBusinessId} 
                onValueChange={(value) => handleChange('lineOfBusinessId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select line of business" />
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <Input
                value={formData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                placeholder="https://www.yourbusiness.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <Textarea
              className="min-h-[100px]"
              value={formData.narrative}
              onChange={(e) => handleChange('narrative', e.target.value)}
              placeholder="Tell us about your business, services, and what makes you unique..."
            />
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

export default EditBusinessInfoDialog;
