
import React, { useEffect, useRef } from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from '@/hooks/useCategories';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SignUpFormSchema } from '@/utils/signUpValidation';

interface BusinessInformationCardProps {
  control: Control<SignUpFormSchema>;
}

const BusinessInformationCard = ({ control }: BusinessInformationCardProps) => {
  const { data: categories } = useCategories();
  const { data: subscriptions } = useSubscriptions();
  const businessNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the Business Name field when component mounts
    if (businessNameInputRef.current) {
      businessNameInputRef.current.focus();
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name *</FormLabel>
                <FormControl>
                  <Input 
                    ref={businessNameInputRef}
                    placeholder="Enter your business name" 
                    {...field} 
                    required 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lineOfBusinessId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line of Business *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.lineOfBusinessId} value={category.lineOfBusinessId}>
                        {category.lineOfBusinessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="subscriptionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Plan *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subscriptions?.filter(sub => !sub.comingSoon).map((subscription) => (
                      <SelectItem key={subscription.subscriptionId} value={subscription.subscriptionId}>
                        {subscription.displayName} - {subscription.formattedMonthlyPrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.yourbusiness.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="signupCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sign Up Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your sign up code (if applicable)" 
                    {...field}
                    onChange={(e) => {
                      // Remove spaces and convert to uppercase for consistency
                      const cleanValue = e.target.value.replace(/\s/g, '').toUpperCase();
                      field.onChange(cleanValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="narrative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your business, services, and what makes you unique..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BusinessInformationCard;
