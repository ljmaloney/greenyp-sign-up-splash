
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MapPin, DollarSign } from 'lucide-react';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
  createDate: string;
  adTypeId: string;
}

interface ClassifiedSummaryCardProps {
  classified: ClassifiedData;
}

const ClassifiedSummaryCard = ({ classified }: ClassifiedSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Title</p>
          <p className="font-medium">{classified.title}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Description</p>
          <p className="text-sm">{classified.description}</p>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="text-sm">
              {classified.address}, {classified.city}, {classified.state} {classified.postalCode}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Price</p>
            <p className="font-semibold text-lg">${classified.price} {classified.perUnitType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedSummaryCard;
