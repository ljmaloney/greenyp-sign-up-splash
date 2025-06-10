
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UserFormFields from './UserFormFields';
import PasswordFields from './PasswordFields';
import { validatePasswords } from '@/utils/userFormValidation';
import { updateAuthorizedUser } from '@/services/authorizedUserService';

interface AuthorizedUser {
  id: string;
  firstName: string;
  lastName: string;
  businessPhone: string;
  cellPhone: string;
  emailAddress: string;
  userName: string;
}

interface EditAuthorizedUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthorizedUser;
  onUserUpdated: (user: AuthorizedUser) => void;
}

const EditAuthorizedUserDialog = ({ isOpen, onClose, user, onUserUpdated }: EditAuthorizedUserDialogProps) => {
  const [formData, setFormData] = useState<AuthorizedUser>(user);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setFormData(user);
  }, [user]);

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
      await updateAuthorizedUser(formData, password);
      
      toast({
        title: "User Updated",
        description: "Authorized user has been successfully updated.",
      });
      
      onUserUpdated(formData);
      onClose();
    } catch (error) {
      console.error('Error updating authorized user:', error);
      toast({
        title: "Error",
        description: "Failed to update authorized user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = (field: keyof AuthorizedUser, value: string) => {
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
          <DialogTitle>Edit Authorized User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields 
            formData={formData}
            onFieldChange={handleFieldChange}
          />
          
          <PasswordFields
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            isEdit={true}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
              Update User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAuthorizedUserDialog;
