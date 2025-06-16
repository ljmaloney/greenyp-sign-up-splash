
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact } from '@/services/accountService';
import { useDashboardContactForm } from '@/hooks/useDashboardContactForm';

interface EditDashboardContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  locationId: string;
}

const EditDashboardContactDialog = ({ 
  isOpen, 
  onClose, 
  contact,
  locationId
}: EditDashboardContactDialogProps) => {
  const { formData, isSubmitting, handleChange, handleSubmit } = useDashboardContactForm({
    contact,
    locationId,
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Type
              </label>
              <Select value={formData.producerContactType} onValueChange={(value) => handleChange('producerContactType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARY">Primary Contact</SelectItem>
                  <SelectItem value="ADMIN">Administrative Contact</SelectItem>
                  <SelectItem value="SALES">Sales Contact</SelectItem>
                  <SelectItem value="ACCOUNTS_PAYABLE">Accounts Payable</SelectItem>
                  <SelectItem value="DISABLED">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Type
              </label>
              <Select value={formData.displayContactType} onValueChange={(value) => handleChange('displayContactType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_DISPLAY">Do not display</SelectItem>
                  <SelectItem value="FULL_NAME_PHONE_EMAIL">Full name, phone, and email</SelectItem>
                  <SelectItem value="GENERIC_NAME_PHONE_EMAIL">Generic name, phone, and email</SelectItem>
                  <SelectItem value="PHONE_EMAIL_ONLY">Phone and email only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Generic Contact Name
            </label>
            <Input
              value={formData.genericContactName}
              onChange={(e) => handleChange('genericContactName', e.target.value)}
              placeholder="e.g., Sales Team, Customer Service"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Sales Manager, Owner"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="(555) 123-4567"
                required
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleChange('emailAddress', e.target.value)}
              placeholder="contact@business.com"
              required
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
              {isSubmitting ? 'Saving...' : 'Update Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDashboardContactDialog;
