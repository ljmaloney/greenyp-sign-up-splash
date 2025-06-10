
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UserFormFields from './UserFormFields';
import PasswordFields from './PasswordFields';
import { validatePasswords } from '@/utils/userFormValidation';
import { createAuthorizedUser } from '@/services/authorizedUserService';

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

  const resetForm = () => {
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
  };

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
      await createAuthorizedUser(formData, password);
      
      toast({
        title: "User Added",
        description: "Authorized user has been successfully added.",
      });
      
      onUserAdded(formData);
      onClose();
      resetForm();
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
