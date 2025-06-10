
import React from 'react';
import { Input } from "@/components/ui/input";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  isEdit?: boolean;
}

const PasswordFields = ({ 
  password, 
  confirmPassword, 
  onPasswordChange, 
  onConfirmPasswordChange,
  isEdit = false 
}: PasswordFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          placeholder={isEdit ? "Enter new password" : "Enter password"}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          placeholder={isEdit ? "Confirm new password" : "Confirm password"}
        />
      </div>
    </div>
  );
};

export default PasswordFields;
