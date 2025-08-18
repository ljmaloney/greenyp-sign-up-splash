
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { useAdPackages } from '@/hooks/classifieds/useAdPackages';
import { AdPackage } from '@/types/adPackages';
import PrototypeAdPopup from './PrototypeAdPopup';

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
              className={`border rounded-lg p-6 cursor-pointer transition-colors flex flex-col ${
                selectedTier === adPackage.adTypeId 
                  ? 'bg-yellow-50 border-yellow-500 border-2' 
                  : 'border-greenyp-500 hover:bg-greenyp-50'
              }`}
            >
              <div className="font-semibold text-lg mb-2">{adPackage.adTypeName}</div>
              <div className="text-2xl font-bold text-greenyp-600 mb-4">${adPackage.monthlyPrice}/month</div>
              
              <div className="space-y-3 flex-grow">
                {adPackage.features.features.map((feature, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-600">
                    <span className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    </span>
                    <span className="text-left flex-1">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <PrototypeAdPopup adPackage={adPackage} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingTierSelector;
