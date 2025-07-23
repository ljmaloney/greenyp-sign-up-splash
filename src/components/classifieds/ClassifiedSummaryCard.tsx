
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, MapPin } from 'lucide-react';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description?: string;
  price?: string;
  location?: string;
  category?: string;
}

interface ClassifiedSummaryCardProps {
  classified: ClassifiedData;
}

const ClassifiedSummaryCard = ({ classified }: ClassifiedSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{classified.title}</h3>
          {classified.description && (
            <p className="text-gray-600 text-sm mt-1">{classified.description}</p>
          )}
        </div>

        {classified.category && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="text-sm font-medium">{classified.category}</span>
          </div>
        )}

        {classified.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{classified.location}</span>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg">{classified.price || '$1.00'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassifiedSummaryCard;
