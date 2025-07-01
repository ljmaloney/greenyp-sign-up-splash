
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { useAdPackages } from '@/hooks/useAdPackages';
import { AdPackage } from '@/types/adPackages';

interface PricingTierSelectorProps {
  selectedTier: string;
  onTierChange: (tier: string) => void;
}

const PricingTierSelector = ({ selectedTier, onTierChange }: PricingTierSelectorProps) => {
  const { data: adPackagesData, isLoading, error } = useAdPackages();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Ad Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading ad packages...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Ad Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading ad packages. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const adPackages = adPackagesData?.response?.filter(pkg => pkg.active) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Ad Package</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adPackages.map((adPackage: AdPackage) => (
            <div
              key={adPackage.adTypeId}
              onClick={() => onTierChange(adPackage.adTypeId)}
              className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                selectedTier === adPackage.adTypeId 
                  ? 'bg-gray-100 border-yellow-500 border-2' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-lg mb-2">{adPackage.adTypeName}</div>
              <div className="text-2xl font-bold text-greenyp-600 mb-4">${adPackage.monthlyPrice}/month</div>
              
              <div className="space-y-3">
                {adPackage.features.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span className="bg-green-100 rounded-full p-1 mr-2 flex-shrink-0">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingTierSelector;
