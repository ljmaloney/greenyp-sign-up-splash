
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpFormSchema, formatPhoneNumber } from '@/utils/signUpValidation';

interface ContactInformationCardProps {
  control: Control<SignUpFormSchema>;
}

const ContactInformationCard = ({ control }: ContactInformationCardProps) => {
  const displayContactType = useWatch({
    control,
    name: "displayContactType"
  });

  const isGenericNameRequired = displayContactType === 'GENERIC_NAME_PHONE_EMAIL';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="displayContactType"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Contact Display Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FULL_NAME_PHONE_EMAIL">
                      Display all details in search results
                    </SelectItem>
                    <SelectItem value="GENERIC_NAME_PHONE_EMAIL">
                      Display only generic name, phone and email in search results
                    </SelectItem>
                    <SelectItem value="PHONE_EMAIL_ONLY">
                      Display only the phone and email in search results
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isGenericNameRequired ? (
            <FormField
              control={control}
              name="genericContactName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Generic Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter generic contact name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="genericContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generic Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional generic contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Job title or position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(555) 123-4567" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                    required 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cellPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cell Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(555) 123-4567" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
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

export default ContactInformationCard;
