
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import LocationNameField from './location/LocationNameField';
import LocationDisplayTypeField from './location/LocationDisplayTypeField';
import WebsiteUrlField from './location/WebsiteUrlField';
import AddressFields from './location/AddressFields';
import CityStateZipFields from './location/CityStateZipFields';

interface LocationInformationCardProps {
  control: Control<SignUpFormSchema>;
}

const LocationInformationCard = ({ control }: LocationInformationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-800">Business Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
                <LocationDisplayTypeField control={control}/>
            </div>
            <LocationNameField control={control} />
          
          <WebsiteUrlField control={control} />
            <AddressFields control={control}/>
            <CityStateZipFields control={control} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInformationCard;
