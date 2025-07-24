
import React from 'react';
import { Control } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SignUpFormSchema } from '@/utils/signUpValidation';

interface LocationDisplayTypeFieldProps {
  control: Control<SignUpFormSchema>;
}

const LocationDisplayTypeField = ({ control }: LocationDisplayTypeFieldProps) => {
  return (
    <FormField
      control={control}
      name="locationDisplayType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location Display Type *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select display type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="CITY_STATE_ZIP">
                Display only the city, state, and zip code in search results
              </SelectItem>
              <SelectItem value="FULL_ADDRESS">
                Display the full address in the search results
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationDisplayTypeField;
