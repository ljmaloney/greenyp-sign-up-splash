
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UserFormFields from './UserFormFields';
import PasswordFields from './PasswordFields';
import { validatePasswords } from '@/utils/userFormValidation';

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
    
    const validation = validatePasswords(password, confirmPassword);
    if (!validation.isValid) {
      toast({
        title: validation.error!.title,
        description: validation.error!.description,
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

  const handleFieldChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Default username to email address when email is entered
    if (field === 'emailAddress') {
      setFormData(prev => ({ ...prev, userName: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Authorized User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields 
            formData={formData as any}
            onFieldChange={handleFieldChange as any}
          />
          
          <PasswordFields
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            isEdit={false}
          />
          
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
