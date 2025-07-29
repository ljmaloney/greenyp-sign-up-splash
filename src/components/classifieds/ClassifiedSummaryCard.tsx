
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
          <h3 className="font-semibold text-lg">{classified.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{classified.description}</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{classified.address}, {classified.city}, {classified.state} {classified.postalCode}</span>
        </div>
        
        <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
          <DollarSign className="h-5 w-5" />
          <span>${classified.price} {classified.perUnitType}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="font-semibold">${classified.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedSummaryCard;
