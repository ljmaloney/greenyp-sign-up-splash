
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpFormData } from '@/types/signUpForm';

interface LocationInformationCardProps {
  control: Control<SignUpFormData>;
}

const LocationInformationCard = ({ control }: LocationInformationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Business Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1 *</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input placeholder="Suite, unit, building, floor, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter postal code" {...field} required />
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

export default LocationInformationCard;
