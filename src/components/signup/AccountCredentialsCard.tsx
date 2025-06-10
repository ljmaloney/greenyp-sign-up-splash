
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpFormData } from '@/types/signUpForm';

interface AccountCredentialsCardProps {
  control: Control<SignUpFormData>;
}

const AccountCredentialsCard = ({ control }: AccountCredentialsCardProps) => {
  const emailAddress = useWatch({
    control,
    name: "emailAddress"
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
                    placeholder="Choose a username" 
                    {...field} 
                    value={field.value || emailAddress || ''}
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
