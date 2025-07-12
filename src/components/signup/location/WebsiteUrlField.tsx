
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SignUpFormSchema } from '@/utils/signUpValidation';

interface WebsiteUrlFieldProps {
  control: Control<SignUpFormSchema>;
}

const WebsiteUrlField = ({ control }: WebsiteUrlFieldProps) => {
  return (
    <FormField
      control={control}
      name="websiteUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Website URL</FormLabel>
          <FormControl>
            <Input 
              type="url" 
              placeholder="https://www.yourwebsite.com" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WebsiteUrlField;
