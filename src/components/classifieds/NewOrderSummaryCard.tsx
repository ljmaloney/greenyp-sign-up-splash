
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdPackages } from '@/hooks/classifieds/useAdPackages';
import { AdPackage } from '@/types/adPackages';

interface ClassifiedData {
  adTypeId: string;
  title: string;
  price: number;
  perUnitType: string;
}

interface NewOrderSummaryCardProps {
  classified?: ClassifiedData;
}

const NewOrderSummaryCard = ({ classified }: NewOrderSummaryCardProps) => {
  const { data: adPackagesData, isLoading: isLoadingPackages } = useAdPackages();
  
  // Find the matching ad package based on adTypeId
  const selectedPackage = React.useMemo(() => {
    if (!classified?.adTypeId || !adPackagesData?.response) {
      return null;
    }
    
    return adPackagesData.response.find(
      (pkg: AdPackage) => pkg.adTypeId === classified.adTypeId
    );
  }, [classified?.adTypeId, adPackagesData?.response]);

  // Display loading state
  if (isLoadingPackages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">Package</div>
              <div className="text-sm text-gray-600 mt-1">Loading...</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">Price</div>
              <div className="text-lg font-bold text-greenyp-600 mt-1">Loading...</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">Duration</div>
              <div className="text-sm text-gray-600 mt-1">30 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display package information or fallback
  const packageName = selectedPackage?.adTypeName || 'Basic Classified';
  const packagePrice = selectedPackage?.monthlyPrice || 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Package</div>
            <div className="text-sm text-gray-600 mt-1">{packageName}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">Price</div>
            <div className="text-lg font-bold text-greenyp-600 mt-1">${packagePrice}/month</div>
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
