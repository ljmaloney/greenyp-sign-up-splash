
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SignUpFormSchema } from '@/utils/signUpValidation';

interface LocationNameFieldProps {
  control: Control<SignUpFormSchema>;
}

const LocationNameField = ({ control }: LocationNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="locationName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location Name *</FormLabel>
          <FormControl>
            <Input placeholder="Main Office, Headquarters, etc." {...field} required />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationNameField;
