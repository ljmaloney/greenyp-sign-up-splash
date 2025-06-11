
import React, { useEffect } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpFormSchema } from '@/utils/signUpValidation';

interface AccountCredentialsCardProps {
  control: Control<SignUpFormSchema>;
}

const AccountCredentialsCard = ({ control }: AccountCredentialsCardProps) => {
  const emailAddress = useWatch({
    control,
    name: "emailAddress"
  });

  const userName = useWatch({
    control,
    name: "userName"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Account Credentials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Username (defaults to email)" 
                    {...field} 
                    value={field.value || emailAddress || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    required 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div></div>

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} required />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500 mt-1">
                  8-20 characters with at least one letter, number, or special character
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password *</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm password" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCredentialsCard;
