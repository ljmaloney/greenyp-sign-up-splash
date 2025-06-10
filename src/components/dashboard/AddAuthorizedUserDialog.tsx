
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserFormData {
  firstName: string;
  lastName: string;
  businessPhone: string;
  cellPhone: string;
  emailAddress: string;
  userName: string;
}

interface AddAuthorizedUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: UserFormData) => void;
}

const AddAuthorizedUserDialog = ({ isOpen, onClose, onUserAdded }: AddAuthorizedUserDialogProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    businessPhone: '',
    cellPhone: '',
    emailAddress: '',
    userName: ''
  });
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Adding authorized user:', formData);
      
      // Mock producer ID - in real app this would come from user context
      const producerId = 'mock-producer-id';
      
      const response = await fetch(`https://services.greenyp.com/producer/${producerId}/authorize/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          producerContactId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          firstName: formData.firstName,
          lastName: formData.lastName,
          businessPhone: formData.businessPhone,
          cellPhone: formData.cellPhone,
          emailAddress: formData.emailAddress,
          userName: formData.userName,
          credentials: password
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add authorized user: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "User Added",
        description: "Authorized user has been successfully added.",
      });
      
      onUserAdded(formData);
      onClose();
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        businessPhone: '',
        cellPhone: '',
        emailAddress: '',
        userName: ''
      });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error adding authorized user:', error);
      toast({
        title: "Error",
        description: "Failed to add authorized user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Authorized User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Phone
              </label>
              <Input
                value={formData.businessPhone}
                onChange={(e) => handleChange('businessPhone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cell Phone
              </label>
              <Input
                value={formData.cellPhone}
                onChange={(e) => handleChange('cellPhone', e.target.value)}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <Input
                value={formData.userName}
                onChange={(e) => handleChange('userName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAuthorizedUserDialog;
