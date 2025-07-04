
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderSummaryCardProps {
  packageData: any;
}

const OrderSummaryCard = ({ packageData }: OrderSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Package</div>
            <div className="text-sm text-gray-600 mt-1">{packageData?.adTypeName || 'Unknown'}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Price</div>
            <div className="text-lg font-bold text-greenyp-600 mt-1">${packageData?.monthlyPrice || 0}/month</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Duration</div>
            <div className="text-sm text-gray-600 mt-1">30 days</div>
          </div>
        </div>
        {packageData?.features.maxImages > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Includes:</strong> Up to {packageData.features.maxImages} images
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
