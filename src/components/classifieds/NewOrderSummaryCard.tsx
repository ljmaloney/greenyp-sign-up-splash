
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewOrderSummaryCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Package</div>
            <div className="text-sm text-gray-600 mt-1">Basic Classified</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Price</div>
            <div className="text-lg font-bold text-greenyp-600 mt-1">$10/month</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Duration</div>
            <div className="text-sm text-gray-600 mt-1">30 days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewOrderSummaryCard;
